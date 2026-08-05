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
import { OrdersService } from './orders.service';
import { type AuthenticatedClient } from 'src/auth/types/authenticated-client';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';

@UseGuards(FirebaseAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // @Post()
  // create(@Body() createOrderDto: CreateOrderDto) {
  //   return this.ordersService.create(createOrderDto);
  // }

  @Get()
  userOrders(
    @CurrentUser() client: AuthenticatedClient,
  ){
    return this.ordersService.userOrders(client.id);
  }

  @Get('/:id')
  getOrderDetail(
    @CurrentUser() client: AuthenticatedClient,
    @Param('id') id: string) {
    return this.ordersService.getOrderDetails(client.id, +id);
  }

  // @Patch(':id')  
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
