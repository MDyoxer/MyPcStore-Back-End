import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
@Module({
  imports: [PrismaModule, BrandsModule, CategoriesModule, ClientsModule, OrdersModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}
