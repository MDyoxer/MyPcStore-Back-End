import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAllProducts() {
    try {
      const response = await this.prisma.tbl_productos.findMany({
        where: { is_active_pt: 1 },
        select: {
          id_pt: true,
          nombre_pt: true,
          precio_pt: true,
          img_pt: true,
          cat_categoria_pt: {
            select: {
              categoria_ctp: true,
            }
          },
          tbl_marcas: {
            select: {
              marca_mc: true,
            }
          }
        }
      });
      return response.map((producto) => ({
        id: producto.id_pt,
        categoria: producto.cat_categoria_pt.categoria_ctp,
        marca: producto.tbl_marcas?.marca_mc || "SIN MARCA", //TODO: IF NULL CHANGE TO "SIN MARCA" in bd 
        nombre: producto.nombre_pt,
        precio: producto.precio_pt,
        imagen: producto.img_pt,
      }));
    } catch (error) {
      console.error('Error finding all products:', error);
      throw new Error('Error finding all products');
    }
  }

 async productDetails(id: number) {
  try {
    const producto = await this.prisma.tbl_productos.findUnique({
      where: {
        id_pt: id,
      },
      select: {
        nombre_pt: true,
        precio_pt: true,
        img_pt: true,
        descripcion_pt: true,
        stock_pt: true,

        cat_categoria_pt: {
          select: {
            categoria_ctp: true,
          },
        },

        tbl_marcas: {
          select: {
            marca_mc: true,
          },
        },
      },
    });

    if (!producto) {
      throw new Error("Producto no encontrado");
    }

    return {
      nombre: producto.nombre_pt,
      precio: producto.precio_pt,
      imagen: producto.img_pt,
      descripcion: producto.descripcion_pt,
      stock: producto.stock_pt,
      categoria: producto.cat_categoria_pt.categoria_ctp,
      marca: producto.tbl_marcas?.marca_mc ?? "SIN MARCA",
    };
  } catch (error) {
    console.error("Error finding product details:", error);
    throw error;
  }
}

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
