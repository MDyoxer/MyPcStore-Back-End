import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedClient } from 'src/auth/types/authenticated-client';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) { }

  async addProductToCart(createCartDto: CreateCartDto, client: AuthenticatedClient) {
    return await this.prisma.tbl_carrito.create({
      data: {
        id_pt_car: createCartDto.idProducto,
        id_c_car: client.id,
        cantidad_car: createCartDto.cantidad,
      },
    });
  }

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
            }
          },

        }
      })
      return response.map((item) => ({
        id: item.id_car,
        idProducto: item.tbl_productos.id_pt,
        cantidad: item.cantidad_car,
        nombre: item.tbl_productos.nombre_pt,
        precio: item.tbl_productos.precio_pt,
        imagen: item.tbl_productos.img_pt,
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

  remove(id: number) {
    return `This action removes a #${id} cart`;
  }
}
