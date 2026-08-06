import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
//QUERY= para ids
//PARAMS = para filtrar por nombre, categoria, marca, etc
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  //add a new product
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
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
  @Patch('product/:id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }
  //soft delete product
  @Patch('product/:id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
