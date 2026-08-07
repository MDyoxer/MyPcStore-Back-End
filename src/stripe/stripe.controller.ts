import {
  Controller,
  BadRequestException,
  Headers,
  Post,
  Body,
  UseGuards,
  type RawBodyRequest,
  Req,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import type { Request } from 'express';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { type AuthenticatedClient } from 'src/auth/types/authenticated-client';
import { DirectCheckoutDto } from './dto/direct-checkout.dto';
@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('checkout')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(FirebaseAuthGuard, ThrottlerGuard)
  createCheckout(@CurrentUser() client: AuthenticatedClient) {
    return this.stripeService.createCheckout(client.id);
  }

  @Post('direct-checkout')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(FirebaseAuthGuard, ThrottlerGuard)
  createDirectCheckout(
    @CurrentUser() client: AuthenticatedClient,
    @Body() dto: DirectCheckoutDto,
  ){
    return this.stripeService.createDirectCheckout(client.id, dto);
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
