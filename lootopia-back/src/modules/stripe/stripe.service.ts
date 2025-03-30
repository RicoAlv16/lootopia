import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2022-11-15',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'eur',
  ): Promise<{ clientSecret: string }> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // Stripe utilise les centimes
      currency: currency,
      payment_method_types: ['card'],
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  async createCheckoutSession(
    items: Array<{ price: string; quantity: number }>,
  ): Promise<{ url: string }> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
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
