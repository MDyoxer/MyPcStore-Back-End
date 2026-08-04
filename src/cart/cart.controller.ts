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
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { UpdateCartQuantityDto } from './dto/update-cart-quantity.dto';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { type AuthenticatedClient } from 'src/auth/types/authenticated-client';
@Controller('cart')
@UseGuards(FirebaseAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}
  //add product to cart or update the quantity if the product already exists in the cart
  @Post('addToCart')
  addProductToCart(
    @Body() createCartDto: CreateCartDto,
    @CurrentUser() client: AuthenticatedClient,
  ) {
    return this.cartService.addOrUpdateProductToCart(createCartDto, client);
  }
  //get the user cart by uidtoken
  @Get('userCart')
  async userCart(@CurrentUser() client: AuthenticatedClient) {
    return await this.cartService.userCart(client.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartService.findOne(+id);
  }
  //change value from quantity when user wants to change the quantity of a product in the cart 
  @Patch('quantity')
  updateQuantity(
    @Body() updateCartQuantityDto: UpdateCartQuantityDto,
    @CurrentUser() client: AuthenticatedClient,
  ) {
    return this.cartService.updateQuantity(updateCartQuantityDto, client);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return this.cartService.update(+id, updateCartDto);
  }
  //delete a product from the cart by id of the cart and the id of the user
  @Delete('removeItem/:id')
  removeItemCart(
    @Param('id') id: string,
    @CurrentUser() client: AuthenticatedClient,
  ) {
    return this.cartService.removeItemCart(+id, client.id);
  }
}
