/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import { ConflictException, NotFoundException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PrismaService } from 'src/prisma/prisma.service';

jest.mock('src/prisma/prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: any;

  const order = {
    id_ord: 1,
    id_c_ord: 7,
    stripe_payment_intent_id_ord: 'pi_123',
    pagado_ord: false,
  };

  const cartItem = {
    id_pt_car: 10,
    cantidad_car: 2,
    tbl_productos: {
      id_pt: 10,
      nombre_pt: 'Teclado',
      precio_pt: { toString: () => '100.00', toNumber: () => 100 },
      stock_pt: 5,
    },
  };

  beforeEach(() => {
    prisma = {
      $transaction: jest.fn((cb: any) => cb(prisma)),
      tbl_ordenes: {
        updateMany: jest.fn(),
        findFirst: jest.fn(),
      },
      tbl_carrito: {
        findMany: jest.fn(),
        deleteMany: jest.fn(),
      },
      tbl_detalles_orden: {
        createMany: jest.fn(),
      },
      tbl_productos: {
        updateMany: jest.fn(),
      },
    };
    service = new OrdersService(prisma as PrismaService);
  });

  describe('completeOrder', () => {
    it('reutiliza la orden existente si el gate idempotente no actualizó nada', async () => {
      prisma.tbl_ordenes.updateMany.mockResolvedValue({ count: 0 });
      prisma.tbl_ordenes.findFirst.mockResolvedValue(order);

      const result = await service.completeOrder('pi_123');

      expect(result).toBe(order);
      expect(prisma.tbl_carrito.findMany).not.toHaveBeenCalled();
    });

    it('lanza NotFoundException si la orden no existe', async () => {
      prisma.tbl_ordenes.updateMany.mockResolvedValue({ count: 0 });
      prisma.tbl_ordenes.findFirst.mockResolvedValue(null);

      await expect(service.completeOrder('pi_123')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('crea detalles, descuenta stock y vacía el carrito', async () => {
      prisma.tbl_ordenes.updateMany.mockResolvedValue({ count: 1 });
      prisma.tbl_ordenes.findFirst.mockResolvedValue(order);
      prisma.tbl_carrito.findMany.mockResolvedValue([cartItem]);
      prisma.tbl_detalles_orden.createMany.mockResolvedValue({ count: 1 });
      prisma.tbl_productos.updateMany.mockResolvedValue({ count: 1 });
      prisma.tbl_carrito.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.completeOrder('pi_123');

      expect(result).toBe(order);
      expect(prisma.tbl_detalles_orden.createMany).toHaveBeenCalledWith({
        data: [
          {
            id_ord_dto: 1,
            id_pt_dto: 10,
            cantidad_dto: 2,
            precio_guardo_dto: cartItem.tbl_productos.precio_pt,
          },
        ],
      });
      expect(prisma.tbl_productos.updateMany).toHaveBeenCalledWith({
        where: { id_pt: 10, stock_pt: { gte: 2 } },
        data: { stock_pt: { decrement: 2 } },
      });
      expect(prisma.tbl_carrito.deleteMany).toHaveBeenCalledWith({
        where: { id_c_car: 7 },
      });
    });

    it('lanza ConflictException si no alcanza el stock al descontar', async () => {
      prisma.tbl_ordenes.updateMany.mockResolvedValue({ count: 1 });
      prisma.tbl_ordenes.findFirst.mockResolvedValue(order);
      prisma.tbl_carrito.findMany.mockResolvedValue([cartItem]);
      prisma.tbl_productos.updateMany.mockResolvedValue({ count: 0 });

      await expect(service.completeOrder('pi_123')).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
