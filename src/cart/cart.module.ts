import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from 'src/clients/clients.module';
@Module({
  controllers: [CartController],
  providers: [CartService],
  imports: [AuthModule, ClientsModule],
})
export class CartModule {}
