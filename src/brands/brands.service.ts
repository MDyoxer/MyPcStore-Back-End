import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async newBrand(createBrandDto: CreateBrandDto) {
    const response = await this.prisma.tbl_marcas.create({
      data: {
        marca_mc: createBrandDto.marca,
      },
    });
    return response;
  }

  //find all brands
  async findAllBrands() {
    const brands = await this.prisma.tbl_marcas.findMany({
      where: { is_active_mc: 1 },
      select: {
        id_mc: true,
        marca_mc: true,
      },
    });
    return brands.map((brand) => ({
      id: brand.id_mc,
      marca: brand.marca_mc,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    return this.prisma.tbl_marcas.update({
      where: { id_mc: id },
      data: { marca_mc: updateBrandDto.marca },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
