import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class BrandsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createBrandDto: CreateBrandDto) {
    return 'This action adds a new brand';
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

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
