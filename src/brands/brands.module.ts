import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  imports: [AuthModule,ClientsModule]
})
export class BrandsModule {}
