import { Controller, Delete, Get, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  create() {
    return this.categoriesService.create();
  }

  @Delete(':id')
  remove() {
    return this.categoriesService.remove();
  }
}
