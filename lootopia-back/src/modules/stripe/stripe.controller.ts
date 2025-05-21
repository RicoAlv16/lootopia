import {
  Body,
  Controller,
  Headers,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { Request } from 'express';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number }) {
    return this.stripeService.createPaymentIntent(body.amount);
  }

  @Post('create-checkout-session')
  async createCheckoutSession(
    @Body() body: { items: Array<{ price: string; quantity: number }> },
  ) {
    return this.stripeService.createCheckoutSession(body.items);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    return this.stripeService.handleWebhook(signature, request.rawBody);
  }
}
