import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { AdminEmailGuard } from 'src/auth/guard/admin-email.guard';
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @UseGuards(FirebaseAuthGuard, AdminEmailGuard)
  create(@Body() createBrandDto: CreateBrandDto
) {
    return this.brandsService.create(createBrandDto);
  }

  @Get('allBrands')
  async findAllBrands() {
    return this.brandsService.findAllBrands();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(FirebaseAuthGuard, AdminEmailGuard)
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard, AdminEmailGuard)
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
