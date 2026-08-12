import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AdminEmailGuard } from 'src/auth/guard/admin-email.guard';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post('newCat')
  @UseGuards(FirebaseAuthGuard, AdminEmailGuard)
  newCategorie(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.newCategorie(createCategoryDto);
  }

  @Get('allCategories')
  async findAllCat() {
    return this.categoriesService.findAllCat();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard, AdminEmailGuard)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard, AdminEmailGuard)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
