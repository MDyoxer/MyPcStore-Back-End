import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { type AuthenticatedClient } from 'src/auth/types/authenticated-client';

@Controller('favorites')
@UseGuards(FirebaseAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post('addFavorite')
  addFavorite(
    @CurrentUser() client: AuthenticatedClient,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    return this.favoritesService.addFavorite(client.id, createFavoriteDto);
  }

  @Get('getFavorites')
  getAllFavorites(@CurrentUser() client: AuthenticatedClient) {
    return this.favoritesService.getAllFavorites(client.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favoritesService.findOne(+id);
  }

  @Patch('unfavorite/:id')
  unfavorite(
    @CurrentUser() client: AuthenticatedClient,
    @Param('id') id: string,
  ) {
    return this.favoritesService.unfavorite(client.id, +id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritesService.remove(+id);
  }
}
