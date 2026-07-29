import { Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) { }
  create(createCartDto: CreateCartDto) {
    return 'This action adds a new cart';
  }
//get user cart by email
  async userCart() {
    try {
      const response = await this.prisma.tbl_carrito.findMany({
        where: {},//TODO: Parametro email del usuario logueado
        select: {
          cantidad_car: true,
          tbl_productos: {
            select: {
              nombre_pt: true,
              precio_pt: true,
              img_pt: true,
            }
          },

        }
      })
      return response.map((item) => ({
        cantidad: item.cantidad_car,
        nombre: item.tbl_productos.nombre_pt,
        precio: item.tbl_productos.precio_pt,
        img: item.tbl_productos.img_pt,
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
