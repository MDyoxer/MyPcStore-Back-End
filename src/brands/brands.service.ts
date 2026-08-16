import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

<<<<<<< Updated upstream
  async newBrand(createBrandDto: CreateBrandDto) {
    const response = await this.prisma.tbl_marcas.create({
      data: {
        marca_mc: createBrandDto.marca,
      },
    });
    return response;
=======
  async create(createBrandDto: CreateBrandDto) {
    return this.prisma.tbl_marcas.create({
      data: {
        marca_mc: createBrandDto.marca_mc,
        is_active_mc: createBrandDto.is_active_mc ?? 1,
      },
    });
>>>>>>> Stashed changes
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

  async findOne(id: number) {
    return this.prisma.tbl_marcas.findUnique({
      where: { id_mc: id },
    });
  }

  async update(id: number, updateBrandDto: UpdateBrandDto) {
    return this.prisma.tbl_marcas.update({
      where: { id_mc: id },
<<<<<<< Updated upstream
      data: { marca_mc: updateBrandDto.marca },
=======
      data: updateBrandDto,
>>>>>>> Stashed changes
    });
  }

  async remove(id: number) {
    return this.prisma.tbl_marcas.update({
      where: { id_mc: id },
      data: { is_active_mc: 0 },
    });
  }
}
