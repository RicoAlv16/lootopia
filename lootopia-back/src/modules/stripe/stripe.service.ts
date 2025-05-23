import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly paymentMethods: Stripe.Checkout.SessionCreateParams.PaymentMethodType[] =
    [
      'card',
      'paypal',
      'klarna',
      'bancontact',
      'giropay',
      'ideal',
      'sepa_debit',
      'sofort',
      'p24',
    ];

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-04-30.basil',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'eur',
    paymentMethod?: Stripe.Checkout.SessionCreateParams.PaymentMethodType,
  ): Promise<{
    clientSecret: string;
    availablePaymentMethods: Stripe.Checkout.SessionCreateParams.PaymentMethodType[];
  }> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: currency,
      payment_method_types: paymentMethod
        ? [paymentMethod]
        : this.paymentMethods,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      availablePaymentMethods: this.paymentMethods, // Plus besoin de cast
    };
  }

  getAvailablePaymentMethods(): string[] {
    return this.paymentMethods; // Plus besoin de cast
  }

  async createCheckoutSession(
    items: Array<{ price: string; quantity: number }>,
    paymentMethod?: Stripe.Checkout.SessionCreateParams.PaymentMethodType,
  ): Promise<{ url: string }> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: paymentMethod
        ? [paymentMethod]
        : this.paymentMethods,
      line_items: items,
      mode: 'payment',
      success_url: `${this.configService.get('FRONTEND_URL')}/payment/success`,
      cancel_url: `${this.configService.get('FRONTEND_URL')}/payment/cancel`,
    });

    return { url: session.url };
  }

  async handleWebhook(signature: string, payload: Buffer): Promise<void> {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          // Gérer le paiement réussi
          console.log('Payment succeeded:', event.data.object);
          break;
        case 'payment_intent.payment_failed':
          // Gérer l'échec du paiement
          console.log('Payment failed:', event.data.object);
          break;
      }
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }
  }
}
