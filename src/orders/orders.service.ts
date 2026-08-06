import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) { }
  //client orders
  async userOrders(id_c: number) {
    const response = await this.prisma.tbl_ordenes.findMany({
      orderBy: { fecha_ord: 'desc' },
      where: { id_c_ord: id_c },
      select: {
        id_ord: true,
        fecha_ord: true,
        total_ord: true,
        pagado_ord: true,
        tbl_detalles_orden: {
          include: {
            tbl_productos: {
              select: {
                img_pt: true,
              },
            },
          },
        },
        tbl_envios: {
          select: { status_env: true },
        },
      },
    });
    return response.map((order) => ({
      idOrden: order.id_ord,
      fechaOrden: order.fecha_ord,
      total: order.total_ord,
      pagado: order.pagado_ord,
      statusEnvio: order.tbl_envios?.status_env,
      imgProductos: order.tbl_detalles_orden.map(
        (d) => d.tbl_productos.img_pt,
      ),
    }));
  }

  //client order details
  async getOrderDetails(id_c: number, id_ord: number) {
    const response = await this.prisma.tbl_detalles_orden.findMany({
      where: {
        id_ord_dto: id_ord,
        tbl_ordenes: { id_c_ord: id_c },
      },
      select: {
        id_dto: true,
        id_ord_dto: true,
        cantidad_dto: true,
        precio_guardo_dto: true,
        tbl_productos: {
          select: {
            id_pt: true,
            nombre_pt: true,
            img_pt: true,
          },
        },
        tbl_ordenes: {
          include: {
            tbl_envios: {
              select: {
                status_env: true,
                detalles_env: true,
                fecha_entrega_estimada_env: true,
              },
            },
          },
        },
      },
    });
    return response.map((item) => ({
      idOrden: item.id_dto,
      cantidad: item.cantidad_dto,
      precioGuardado: item.precio_guardo_dto,
      idProducto: item.tbl_productos.id_pt,
      producto: item.tbl_productos.nombre_pt,
      imgProducto: item.tbl_productos.img_pt,
      statusEnvio: item.tbl_ordenes.tbl_envios?.status_env,
      detallesEnvio: item.tbl_ordenes.tbl_envios?.detalles_env,
      fechaEntregaEstimada:
        item.tbl_ordenes.tbl_envios?.fecha_entrega_estimada_env,
    }));
  }

  //create a pre-order "PENDIENTE"
  async createPendingOrder(
    clientId: number,
    paymentIntentId: string,
    total: number,
  ) {
    return this.prisma.tbl_ordenes.create({
      data: {
        id_c_ord: clientId,
        total_ord: total,
        stripe_payment_intent_id_ord: paymentIntentId,
        tbl_envios: { create: {} },
      },
    });
  }

  //complete the status then change to "pagada"
  async completeOrder(paymentIntentId: string) {
    return this.prisma.$transaction(async (tx) => {
      //just one order with pagado false to true
      const updated = await tx.tbl_ordenes.updateMany({
        where: {
          stripe_payment_intent_id_ord: paymentIntentId,
          pagado_ord: false,
        },
        data: { pagado_ord: true },
      });

      if (updated.count === 0) {
        const existing = await tx.tbl_ordenes.findFirst({
          where: { stripe_payment_intent_id_ord: paymentIntentId },
        });
        if (!existing) throw new NotFoundException('Order not found');
        return existing;
      }

      const order = await tx.tbl_ordenes.findFirst({
        where: { stripe_payment_intent_id_ord: paymentIntentId },
      });

      if (!order) throw new NotFoundException('order not found ');

      const cartItems = await tx.tbl_carrito.findMany({
        where: { id_c_car: order.id_c_ord },
        include: { tbl_productos: true },
      });

      if (cartItems.length === 0)
        throw new NotFoundException('No items in cart');

      //evaluate if caritems is equal or lower to stock of product
      for (const item of cartItems) {
        if (item.cantidad_car > item.tbl_productos.stock_pt) {
          throw new ConflictException(
            `Stock insuficiente para ${item.tbl_productos.nombre_pt}`,
          );
        }
      }
      //order details
      await tx.tbl_detalles_orden.createMany({
        data: cartItems.map((item) => ({
          id_ord_dto: order.id_ord,
          id_pt_dto: item.id_pt_car,
          cantidad_dto: item.cantidad_car,
          precio_guardo_dto: item.tbl_productos.precio_pt,
        })),
      });
      //update the stock of each product
      for (const item of cartItems) {
        const result = await tx.tbl_productos.updateMany({
          where: {
            id_pt: item.id_pt_car,
            stock_pt: { gte: item.cantidad_car },
          },
          data: {
            stock_pt: { decrement: item.cantidad_car },
          },
        });
        if (result.count === 0) {
          throw new ConflictException(
            `Stock insuficiente para ${item.tbl_productos.nombre_pt}`,
          );
        }
      }

      // set the user cart to nothing
      await tx.tbl_carrito.deleteMany({ where: { id_c_car: order.id_c_ord } });

      //change to pagada
      return order;
    });
  }
}
