import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async addFavorite(id: number, createFavoriteDto: CreateFavoriteDto) {
    return this.prisma.tbl_favoritos.upsert({
      where: {
        id_c_fav_id_pt_fav: {
          id_c_fav: id,
          id_pt_fav: createFavoriteDto.idProducto,
        },
      },
      create: {
        id_c_fav: id,
        id_pt_fav: createFavoriteDto.idProducto,
        is_active_fav: 1,
      },
      update: {
        is_active_fav: 1,
      },
    });
  }
  async getAllFavorites(id: number) {
    const response = await this.prisma.tbl_favoritos.findMany({
      where: {
        id_c_fav: id,
        is_active_fav: 1,
      },
      select: {
        id_fav: true,
        id_pt_fav: true,
        agregado_fav: true,
        tbl_productos: {
          select: {
            nombre_pt: true,
            precio_pt: true,
            img_pt: true,

            tbl_marcas: {
              select: {
                marca_mc: true,
              },
            },
            cat_categoria_pt: {
              select: {
                categoria_ctp: true,
              },
            },
          },
        },
      },
    });

    return response.map((item) => ({
      id: item.id_fav,
      idProd: item.id_pt_fav,
      nombre: item.tbl_productos.nombre_pt,
      precio: item.tbl_productos.precio_pt,
      imagen: item.tbl_productos.img_pt,
      marca: item.tbl_productos.tbl_marcas?.marca_mc,
      categoria: item.tbl_productos.cat_categoria_pt.categoria_ctp,
      agregado: item.agregado_fav,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} favorite`;
  }

  async unfavorite(idClient: number, idProd: number) {
    const response = await this.prisma.tbl_favoritos.update({
      where: {
        id_c_fav_id_pt_fav: {
          id_c_fav: idClient,
          id_pt_fav: idProd,
        },
      },
      data: {
        is_active_fav: 0,
      },
    });
    return response;
  }

  remove(id: number) {
    return `This action removes a #${id} favorite`;
  }
}
