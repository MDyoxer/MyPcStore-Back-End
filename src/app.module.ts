import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import * as Joi from 'joi';
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
import { FirebaseAuthGuard } from './auth/guard/firebase-auth.guard';
import { FavoritesModule } from './favorites/favorites.module';
import { StripeModule } from './stripe/stripe.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.string().optional(),
        CORS_ORIGIN: Joi.string().optional(),
        ADMIN_EMAILS: Joi.string().required(),
        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_CLIENT_EMAIL: Joi.string().required(),
        FIREBASE_PRIVATE_KEY: Joi.string().required(),
        FIREBASE_BUCKET: Joi.string().required(),
        STRIPE_PRIVATE_API_KEY: Joi.string().required(),
        STRIPE_WEBHOOK_SECRET: Joi.string().required(),
        STRIPE_CURRENCY: Joi.string().optional(),
      }),
    }),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60000, limit: 30 }]),
    PrismaModule,
    AuthModule,
    BrandsModule,
    CategoriesModule,
    ClientsModule,
    OrdersModule,
    ProductsModule,
    CartModule,
    FavoritesModule,
    StripeModule.forRootAsync(),
  ],
  controllers: [AppController],
  providers: [AppService, FirebaseAuthGuard],
  exports: [FirebaseAuthGuard],
})
export class AppModule {}
