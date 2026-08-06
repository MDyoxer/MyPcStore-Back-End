import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
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

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
