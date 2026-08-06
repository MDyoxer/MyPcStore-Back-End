/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
import { ConflictException } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrdersService } from 'src/orders/orders.service';

jest.mock('src/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));
jest.mock('src/orders/orders.service', () => ({
  OrdersService: class OrdersService {},
}));

describe('StripeService', () => {
  let service: StripeService;
  let prisma: any;

  const cartItem = {
    id_car: 1,
    id_c_car: 7,
    id_pt_car: 10,
    cantidad_car: 2,
    tbl_productos: {
      id_pt: 10,
      nombre_pt: 'Teclado',
      precio_pt: { toString: () => '999.50', toNumber: () => 999.5 },
      stock_pt: 5,
    },
  };

  const createdOrder = {
    id_ord: 1,
    id_c_ord: 7,
    stripe_payment_intent_id_ord: 'pi_abc',
  };

  const paymentIntent = {
    id: 'pi_abc',
    client_secret: 'cs_abc',
    amount: 199900,
    currency: 'mxn',
  };

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn((cb: any) => cb(prisma)),
      $queryRaw: jest.fn().mockResolvedValue([]),
      tbl_ordenes: {
        findMany: jest.fn().mockResolvedValue([]),
        deleteMany: jest.fn(),
        create: jest.fn().mockResolvedValue(createdOrder),
      },
      tbl_envios: {
        deleteMany: jest.fn(),
      },
      tbl_carrito: {
        findMany: jest.fn(),
      },
    };
    const config = {
      get: jest.fn((key: string) =>
        key === 'STRIPE_CURRENCY' ? 'mxn' : undefined,
      ),
    };
    service = new StripeService(
      'sk_test_x',
      'whsec_x',
      prisma as PrismaService,
      {} as OrdersService,
      config as any,
    );
    (service as any).stripe = {
      paymentIntents: {
        create: jest.fn().mockResolvedValue(paymentIntent),
        cancel: jest.fn().mockResolvedValue({}),
      },
    };
  });

  describe('createCheckout', () => {
    it('lanza ConflictException si el carrito está vacío', async () => {
      prisma.tbl_carrito.findMany.mockResolvedValue([]);

      await expect(service.createCheckout(7)).rejects.toThrow(
        ConflictException,
      );
      expect(
        (service as any).stripe.paymentIntents.create,
      ).not.toHaveBeenCalled();
    });

    it('cancela PaymentIntents huérfanos y borra sus órdenes', async () => {
      prisma.tbl_ordenes.findMany.mockResolvedValue([
        { id_ord: 5, stripe_payment_intent_id_ord: 'pi_orphan' },
      ]);
      prisma.tbl_carrito.findMany.mockResolvedValue([cartItem]);

      await service.createCheckout(7);

      expect(
        (service as any).stripe.paymentIntents.cancel,
      ).toHaveBeenCalledWith('pi_orphan');
      expect(prisma.tbl_envios.deleteMany).toHaveBeenCalled();
      expect(prisma.tbl_ordenes.deleteMany).toHaveBeenCalled();
    });

    it('crea el PaymentIntent con el total correcto y persiste la orden', async () => {
      prisma.tbl_carrito.findMany.mockResolvedValue([cartItem]);

      const result = await service.createCheckout(7);

      expect(
        (service as any).stripe.paymentIntents.create,
      ).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 199900,
          currency: 'mxn',
        }),
        expect.objectContaining({
          idempotencyKey: expect.any(String),
        }),
      );
      expect(prisma.tbl_ordenes.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            id_c_ord: 7,
            stripe_payment_intent_id_ord: 'pi_abc',
          }),
        }),
      );
      expect(result).toEqual({
        clientSecret: 'cs_abc',
        paymentIntentId: 'pi_abc',
        orderId: 1,
        amount: 199900,
        currency: 'mxn',
      });
    });
  });
});
