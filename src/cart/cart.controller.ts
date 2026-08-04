import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { type AuthenticatedClient } from 'src/auth/types/authenticated-client';
@Controller('cart')
@UseGuards(FirebaseAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) { }

 @Post('addToCart')
  addProductToCart(
    @Body() createCartDto: CreateCartDto, 
    @CurrentUser() client: AuthenticatedClient
  ){
    return this.cartService.addOrUpdateProductToCart(createCartDto, client);
  }


  @Get('userCart')
  async userCart(
    @CurrentUser() client: AuthenticatedClient
  ) {
    return await this.cartService.userCart(client.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }

  @Delete('removeItem/:id')
  removeItemCart(
    @Param('id') id: string,
    @CurrentUser() client: AuthenticatedClient
  ) {
      return this.cartService.removeItemCart(+id,client.id);
  }
}
