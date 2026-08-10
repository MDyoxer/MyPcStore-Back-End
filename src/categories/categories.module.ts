import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from 'src/clients/clients.module';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService],
  imports: [AuthModule,ClientsModule]
})
export class CategoriesModule {}
