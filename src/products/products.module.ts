import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [AuthModule,ClientsModule]
})
export class ProductsModule {}
