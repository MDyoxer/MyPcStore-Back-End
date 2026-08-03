import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { ClientsModule } from './clients/clients.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { FirebaseAdminService } from './auth/firebase-admin.service';
import { FirebaseAuthGuard } from './auth/guard/firebase-auth.guard';
import { FavoritesModule } from './favorites/favorites.module';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, BrandsModule, CategoriesModule, ClientsModule, OrdersModule, ProductsModule, CartModule, FavoritesModule],
  controllers: [AppController],
  providers: [AppService, FirebaseAdminService, FirebaseAuthGuard],
  exports: [FirebaseAdminService, FirebaseAuthGuard],
})
export class AppModule {}
