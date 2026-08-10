/// <reference types="multer" />
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { AdminEmailGuard } from 'src/auth/guard/admin-email.guard';
//QUERY= para ids
//PARAMS = para filtrar por nombre, categoria, marca, etc

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }
  //add a new product
  @Post('newProduct')
  @UseGuards(FirebaseAuthGuard, AdminEmailGuard)
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  }))
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.productsService.newProduct(createProductDto, file);
  }
  //get all products
  @Get('findAllProducts')
  async findAllProducts() {
    return await this.productsService.findAllProducts();
  }

  //get product details by id
  @Get('product/:id')
  async productDetails(@Param('id') id: string) {
    return await this.productsService.productDetails(+id);
  }
  //update product information
  @Patch('/:id')
  @UseGuards(FirebaseAuthGuard, AdminEmailGuard)
  updateProd(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProd(+id, updateProductDto);
  }
  //soft delete desactivate product
  @Patch('desactive/:id')
  @UseGuards(FirebaseAuthGuard, AdminEmailGuard)
  desactivateProd(@Param('id') id: string) {
    return this.productsService.desactivateProd(+id);
  }
  //soft delete activate product
  @Patch('active/:id')
  @UseGuards(FirebaseAuthGuard, AdminEmailGuard)
  activateProd(@Param('id') id: string) {
    return this.productsService.activateProd(+id);
  }
}
