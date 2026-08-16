import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
<<<<<<< Updated upstream
  async newCategorie(dto: CreateCategoryDto) {
   const response = await this.prisma.cat_categoriasprod.create({
    data: {
      categoria_ctp: dto.categoria,
    }
  });
  return response;
=======
  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.cat_categoriasprod.create({
      data: {
        categoria_ctp: createCategoryDto.categoria_ctp,
        slug_ctp: createCategoryDto.slug_ctp,
        is_active_ctp: createCategoryDto.is_active_ctp ?? 1,
      },
    });
>>>>>>> Stashed changes
  }

  async findAllCat() {
    const categories = await this.prisma.cat_categoriasprod.findMany({
      where: { is_active_ctp: 1 },
      select: {
        id_ctp: true,
        categoria_ctp: true,
        slug_ctp: true,
      },
    });
    return categories.map((category) => ({
      id: category.id_ctp,
      categoria: category.categoria_ctp,
      slug: category.slug_ctp,
    }));
  }

  async findOne(id: number) {
    return this.prisma.cat_categoriasprod.findUnique({
      where: { id_ctp: id },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.cat_categoriasprod.update({
      where: { id_ctp: id },
<<<<<<< Updated upstream
      data: { categoria_ctp: updateCategoryDto.categoria },
=======
      data: updateCategoryDto,
>>>>>>> Stashed changes
    });
  }

  async remove(id: number) {
    return this.prisma.cat_categoriasprod.update({
      where: { id_ctp: id },
      data: { is_active_ctp: 0 },
    });
  }
}
