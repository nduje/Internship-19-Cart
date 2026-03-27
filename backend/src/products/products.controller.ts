import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne() {
    return this.productsService.findOne();
  }

  @Post()
  create() {
    return this.productsService.create();
  }

  @Put(':id')
  update() {
    return this.productsService.update();
  }

  @Delete(':id')
  remove() {
    return this.productsService.remove();
  }
}
