import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import type { tbl_clientes } from 'generated/prisma/client';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
@Controller('cart')
@UseGuards(FirebaseAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) { }

 @Post()
  addProductToCart(
    @Body() createCartDto: CreateCartDto, 
    @CurrentUser() client: tbl_clientes
  ){
    return this.cartService.addProductToCart(createCartDto, client);
  }


  @Get('userCart')
  async userCart(
    @CurrentUser() client: tbl_clientes
  ) {
    return await this.cartService.userCart(client.id_c);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartService.remove(+id);
  }
}
