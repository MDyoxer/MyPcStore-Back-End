import { Injectable, Inject, Logger, ConflictException, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersService } from 'src/orders/orders.service';
@Injectable()
//TODO: warning stripe key will expire in 90 days: october 2026
export class StripeService {
  private stripe: Stripe;
  private logger = new Logger(StripeService.name);

  //stripe configuration
  constructor(
    @Inject('STRIPE_PRIVATE_API_KEY') private readonly apiKey: string,
    @Inject('STRIPE_WEBHOOK_SECRET') private readonly webhookSecret: string,
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
  ) {
    if (!this.apiKey) throw new Error('Stripe API KEY is missing');
    if (!this.webhookSecret) throw new Error('Stripe WEBHOOK SECRET is missing');

    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2026-07-29.dahlia' as any
    });
  }
  //webhook handler for stripe eventss
  async handleWebhookEvent(payload: Buffer, sig: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        this.webhookSecret,
      );
    } catch {
      throw new BadRequestException('Invalid signature');
    }
    //detect event type and handle accordingly
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // finaliza la orden en transacción (idempotente por diseño)
        await this.ordersService.completeOrder(paymentIntent.id);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await this.ordersService.markOrderFailed(paymentIntent.id);
        break;
      }
      default:
        this.logger.log(`Evento no manejado: ${event.type}`);
    }

    return { received: true };
  }

  async createCheckout(clientId: number) {
    //read client cart
    const cartItems = await this.prisma.tbl_carrito.findMany({
      where: { id_c_car: clientId },
      include: { tbl_productos: true },
    });

    if (cartItems.length === 0) {
      throw new ConflictException('Cart is empty');
    }
    //check stock
    for (const item of cartItems) {
      if (item.cantidad_car > item.tbl_productos.stock_pt) {
        throw new ConflictException(`Not enough stock for product ${item.tbl_productos.nombre_pt}`
        );
      }
    }
    //calculate total in cents
    const totalInCents = cartItems.reduce(
      (acc, item) =>
        acc + Math.round(Number(item.tbl_productos.precio_pt) * 100) * item.cantidad_car,
      0,
    );

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: totalInCents,
      currency: 'mxn',   // TODO: centralizar moneda
      metadata: {
        clientId: String(clientId), cartItems: JSON.stringify(cartItems.map(item => ({
          productId: item.id_pt_car,
          quantity: item.cantidad_car,
        })))
      },
    });


    const order = await this.ordersService.createPendingOrder(
      clientId, paymentIntent.id, totalInCents / 100,
    );

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      orderId: order.id_ord,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    };
  }
}
