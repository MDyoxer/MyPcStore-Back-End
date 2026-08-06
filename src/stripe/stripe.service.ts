import {
  Injectable,
  Inject,
  Logger,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import Stripe from 'stripe';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersService } from 'src/orders/orders.service';
import { toCents, centsToDecimal } from 'src/common/money.util';
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
    private readonly config: ConfigService,
  ) {
    if (!this.apiKey) throw new Error('Stripe API KEY is missing');
    if (!this.webhookSecret)
      throw new Error('Stripe WEBHOOK SECRET is missing');

    // apiVersion se omite a propósito: usa el default del SDK
    this.stripe = new Stripe(this.apiKey);
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
        const paymentIntent = event.data.object;
        // finaliza la orden en transacción (idempotente por diseño)
        const order = await this.ordersService.completeOrder(paymentIntent.id);
        this.logger.log(
          `payment_intent.succeeded ${paymentIntent.id} -> order ${order.id_ord} (${paymentIntent.amount} ${paymentIntent.currency})`,
        );
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        this.logger.warn(`payment_intent.payment_failed ${paymentIntent.id}`);
        break;
      }
      default:
        this.logger.log(`Evento no manejado: ${event.type}`);
    }

    return { received: true };
  }

  async createCheckout(clientId: number) {
    return this.prisma.$transaction(async (tx) => {
      // el 2º POST concurrente se queda esperando aquí
      await tx.$queryRaw`SELECT id_c FROM tbl_clientes WHERE id_c = ${clientId} FOR UPDATE`;

      // limpia solo huérfanas sin detalle
      const unpaidOrders = await tx.tbl_ordenes.findMany({
        where: {
          id_c_ord: clientId,
          pagado_ord: false,
          tbl_detalles_orden: { none: {} },
        },
        select: { id_ord: true, stripe_payment_intent_id_ord: true },
      });

      if (unpaidOrders.length > 0) {
        for (const unpaid of unpaidOrders) {
          if (unpaid.stripe_payment_intent_id_ord) {
            await this.stripe.paymentIntents
              .cancel(unpaid.stripe_payment_intent_id_ord)
              .catch((err: Error) =>
                this.logger.debug(
                  `No se pudo cancelar el PaymentIntent huérfano ${unpaid.stripe_payment_intent_id_ord}: ${err.message}`,
                ),
              );
          }
        }
        await tx.tbl_envios.deleteMany({
          where: { id_ord_env: { in: unpaidOrders.map((o) => o.id_ord) } },
        });
        await tx.tbl_ordenes.deleteMany({
          where: { id_ord: { in: unpaidOrders.map((o) => o.id_ord) } },
        });
      }

      // carrito, stock y total (igual que hoy)
      const cartItems = await tx.tbl_carrito.findMany({
        where: { id_c_car: clientId },
        include: { tbl_productos: true },
      });
      if (cartItems.length === 0) throw new ConflictException('Cart is empty');
      for (const item of cartItems) {
        if (item.cantidad_car > item.tbl_productos.stock_pt) {
          throw new ConflictException(
            `Not enough stock for product ${item.tbl_productos.nombre_pt}`,
          );
        }
      }
      const totalInCents = cartItems.reduce(
        (acc, item) =>
          acc + toCents(item.tbl_productos.precio_pt ?? 0) * item.cantidad_car,
        0,
      );

      const paymentIntent = await this.stripe.paymentIntents.create(
        {
          amount: totalInCents,
          currency: this.config.get<string>('STRIPE_CURRENCY') ?? 'mxn',
          metadata: {
            clientId: String(clientId),
            cartItems: JSON.stringify(
              cartItems.map((item) => ({
                productId: item.id_pt_car,
                productName: item.tbl_productos.nombre_pt,
                quantity: item.cantidad_car,
              })),
            ),
          },
        },
        { idempotencyKey: `checkout_${randomUUID()}` },
      );

      const order = await tx.tbl_ordenes.create({
        data: {
          id_c_ord: clientId,
          total_ord: centsToDecimal(totalInCents),
          stripe_payment_intent_id_ord: paymentIntent.id,
          tbl_envios: { create: {} },
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        orderId: order.id_ord,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      };
    });
  }
}
