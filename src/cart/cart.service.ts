import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedClient } from 'src/auth/types/authenticated-client';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) { }

  async addOrUpdateProductToCart(createCartDto: CreateCartDto, client: AuthenticatedClient) {
    return await this.prisma.tbl_carrito.upsert({
      where: { 
        id_c_car_id_pt_car:{
          id_c_car: client.id,
          id_pt_car: createCartDto.idProducto
        }
      },
      update: {
        cantidad_car: {
          increment : createCartDto.cantidad
        }
      },
      create: {
        id_pt_car: createCartDto.idProducto,
        id_c_car: client.id,
        cantidad_car: createCartDto.cantidad,
      }
    });
  };

  async userCart(id: number) {
    try {
      const response = await this.prisma.tbl_carrito.findMany({
        where: { id_c_car: id },
        select: {
          cantidad_car: true,
          id_car: true,
          tbl_productos: {
            select: {
              id_pt: true,
              nombre_pt: true,
              precio_pt: true,
              img_pt: true,
              stock_pt: true,
            }
          },

        }
      })
      return response.map((item) => ({
        idCarrito: item.id_car,
        idProducto: item.tbl_productos.id_pt,
        cantidad: item.cantidad_car,
        nombre: item.tbl_productos.nombre_pt,
        precio: item.tbl_productos.precio_pt,
        imagen: item.tbl_productos.img_pt,
        stock: item.tbl_productos.stock_pt, 
      }));
    } catch (error) {
      console.error('Error finding user cart:', error);
      throw new Error('Error finding user cart');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} cart`;
  }

  update(id: number, updateCartDto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

 async removeItemCart(id: number, id_c: number) {
    const response = await this.prisma.tbl_carrito.deleteMany({
      where: { id_c_car: id_c, id_car: id } //delete the user cart item based on uid token
    })
    return response;
  }
}
