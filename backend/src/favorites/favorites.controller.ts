import { Controller, Delete, Get, Post } from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  create() {
    return this.favoritesService.create();
  }

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Delete(':id')
  remove() {
    return this.favoritesService.remove();
  }
}
