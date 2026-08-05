import { Controller, BadRequestException, Get,  Headers, Post, Body, Patch, Param, Delete, UseGuards, type RawBodyRequest, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import{ type  Request } from 'express';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { type AuthenticatedClient } from 'src/auth/types/authenticated-client';
@Controller('stripe')
export class StripeController {
  constructor(
    private readonly stripeService: StripeService) { }

  @Post('checkout')
  @UseGuards(FirebaseAuthGuard)
  createCheckout(
    @CurrentUser() client: AuthenticatedClient
  ) {
    return this.stripeService.createCheckout(client.id);
  }

  @Post('webhook')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    if (!signature || !req.rawBody) {
      throw new BadRequestException('Missing signature or raw body');
    }
    return this.stripeService.handleWebhookEvent(req.rawBody, signature);
  }
}
