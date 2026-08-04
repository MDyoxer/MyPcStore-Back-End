import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService, ConfigModule} from '@nestjs/config';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {
  static forRoot(): DynamicModule {
    return {
      module: StripeModule,
      imports: [ConfigModule],
      providers : [
        StripeService,
        {
          provide: 'STRIPE_PRIVATE_API_KEY',
          useFactory: (ConfigService: ConfigService) => 
            ConfigService.get<string>('STRIPE_PRIVATE_API_KEY'),
          inject: [ConfigService],
        },
      ],
      controllers: [StripeController],
      exports: [StripeService],
    };
  }
}
