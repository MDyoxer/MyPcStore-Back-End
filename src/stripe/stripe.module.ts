import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      imports: [
        ConfigModule,
        ThrottlerModule,
        OrdersModule,
        AuthModule,
        ClientsModule,
      ],
      providers: [
        StripeService,
        {
          provide: 'STRIPE_PRIVATE_API_KEY',
          useFactory: (config: ConfigService) =>
            config.get<string>('STRIPE_PRIVATE_API_KEY'),
          inject: [ConfigService],
        },
        {
          provide: 'STRIPE_WEBHOOK_SECRET',
          useFactory: (config: ConfigService) =>
            config.get<string>('STRIPE_WEBHOOK_SECRET'),
          inject: [ConfigService],
        },
      ],
      controllers: [StripeController],
      exports: [StripeService],
    };
  }
}
