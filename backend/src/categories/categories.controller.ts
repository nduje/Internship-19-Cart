import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiResponse({ status: 200, description: 'Categories retrieved' })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiResponse({ status: 201, description: 'Category created' })
  @ApiResponse({ status: 500, description: 'Category already exists' })
  @Post()
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 200, description: 'Category deleted' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(+id);
  }
}
