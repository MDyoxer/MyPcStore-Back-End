import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { buildStoragePathFromSegments, uploadFileToStorageAndGetSignedUrl } from 'src/utils/firebase-storage-util';
@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) { }
  //USED ON findAllProductsAdmin and findAllProducts
  private readonly selectProduct = {
    id_pt: true,
    nombre_pt: true,
    precio_pt: true,
    img_pt: true,
    stock_pt: true,
    is_active_pt: true,
    cat_categoria_pt: { select: { categoria_ctp: true } },
    tbl_marcas: { select: { marca_mc: true } },
  };

<<<<<<< Updated upstream
  private mapProduct(p: any) {
    return {
      id: p.id_pt,
      categoria: p.cat_categoria_pt.categoria_ctp,
      marca: p.tbl_marcas?.marca_mc || 'SIN MARCA',
      nombre: p.nombre_pt,
      precio: p.precio_pt,
      imagen: p.img_pt,
      stock: p.stock_pt,
      activo: p.is_active_pt,
    };
  }


  async newProduct(dto: CreateProductDto, file: Express.Multer.File) {
    try {
      let imgUrl: string | null = dto.imagen_prod;

      if (file) {
        const objectPath = buildStoragePathFromSegments(['products'], file);
        imgUrl = await uploadFileToStorageAndGetSignedUrl(file, objectPath);
      }

      const resposnse = await this.prisma.tbl_productos.create({
        data: {
          nombre_pt: dto.nombre_prod,
          precio_pt: dto.precio_prod,
          img_pt: imgUrl,
          specs_pt: dto.specs_prod,
          descripcion_pt: dto.descripcion_prod,
          stock_pt: dto.stock_prod,
          id_ctp_pt: dto.id_ctp_prod,
          id_mc_pt: dto.id_marca_prod
        }
      })
      return resposnse;
    } catch (error) {
      console.error('Error creating new product:', error);
      throw new Error('Error creating new product');
    }
=======
  async create(createProductDto: CreateProductDto) {
    return this.prisma.tbl_productos.create({
      data: createProductDto,
    });
>>>>>>> Stashed changes
  }

  async findAllProducts() {
    const r = await this.prisma.tbl_productos.findMany({ where: { is_active_pt: 1 }, select: this.selectProduct });
    return r.map(this.mapProduct);
  }

  async findAllProductsAdmin() {
    const r = await this.prisma.tbl_productos.findMany({ select: this.selectProduct });
    return r.map(this.mapProduct);
  }

  async productDetails(id: number) {
    try {
      const producto = await this.prisma.tbl_productos.findUnique({
        where: {
          id_pt: id,
        },
        select: {
          id_pt: true,
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
        throw new Error('Producto no encontrado');
      }

      return {
        id: producto.id_pt,
        nombre: producto.nombre_pt,
        precio: producto.precio_pt,
        imagen: producto.img_pt,
        descripcion: producto.descripcion_pt,
        stock: producto.stock_pt,
        categoria: producto.cat_categoria_pt.categoria_ctp,
        marca: producto.tbl_marcas?.marca_mc ?? 'SIN MARCA',
      };
    } catch (error) {
      console.error('Error finding product details:', error);
      throw error;
    }
  }

<<<<<<< Updated upstream
  async updateProd(idProd: number, dto: UpdateProductDto) {
    try {
      const response = await this.prisma.tbl_productos.update({
        where: { id_pt: idProd },
        data: {
          nombre_pt: dto.nombre_prod,
          precio_pt: dto.precio_prod,
          stock_pt: dto.stock_prod,
          img_pt: dto.imagen_prod,
          descripcion_pt: dto.descripcion_prod,
          specs_pt: dto.specs_prod,
          id_ctp_pt: dto.id_ctp_prod,
          id_mc_pt: dto.id_marca_prod,
        },
      });
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Error updating product');
    }
  }

  async desactivateProd(idProd: number) {
    try {
      const response = await this.prisma.tbl_productos.update({
        where: { id_pt: idProd },
        data: {
          is_active_pt: 0,
        },
      });
      return response;
    } catch (error) {
      console.error('Error desactivating product:', error);
      throw new Error('Error desactivating product');
    }
  }

  async activateProd(idProd: number) {
    try {
      const response = await this.prisma.tbl_productos.update({
        where: { id_pt: idProd },
        data: {
          is_active_pt: 1,
        },
      });
      return response;
    } catch (error) {
      console.error('Error activating product:', error);
      throw new Error('Error activating product');
    }
=======
  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.tbl_productos.update({
      where: { id_pt: id },
      data: updateProductDto,
    });
  }

  async remove(id: number) {
    return this.prisma.tbl_productos.update({
      where: { id_pt: id },
      data: { is_active_pt: 0 },
    });
>>>>>>> Stashed changes
  }
}
