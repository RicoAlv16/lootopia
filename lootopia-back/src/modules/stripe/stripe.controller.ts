import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';
import Stripe from 'stripe';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body()
    body: {
      amount: number;
      paymentMethod?: Stripe.Checkout.SessionCreateParams.PaymentMethodType;
    },
  ) {
    return this.stripeService.createPaymentIntent(
      body.amount,
      'eur',
      body.paymentMethod,
    );
  }

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body()
    body: {
      items: Array<{ price: string; quantity: number }>;
      paymentMethod?: Stripe.Checkout.SessionCreateParams.PaymentMethodType;
    },
  ) {
    return this.stripeService.createCheckoutSession(
      body.items,
      body.paymentMethod,
    );
  }

  @Get('payment-methods')
  getAvailablePaymentMethods() {
    return { paymentMethods: this.stripeService.getAvailablePaymentMethods() };
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    return this.stripeService.handleWebhook(signature, request.rawBody);
  }
}
