import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ClientsModule } from 'src/clients/clients.module';
@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [AuthModule,ClientsModule],
})
export class FavoritesModule {}
