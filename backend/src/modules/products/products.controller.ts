import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/modules/auth/admin-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiResponse({ status: 200, description: 'Products retrieved.' })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by product name',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: String,
    description: 'Sort products',
  })
  @ApiQuery({
    name: 'inStock',
    required: false,
    type: Boolean,
    description: 'Filter products that are in stock',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number, default 1',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page, default 10',
  })
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: string,
    @Query('sort') sort?: string,
    @Query('inStock', new ParseBoolPipe({ optional: true })) inStock?: boolean,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    return this.productsService.findAll({
      search,
      category,
      sort,
      inStock,
      page,
      limit,
    });
  }

  @ApiResponse({ status: 200, description: 'Product retrieved.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(+id);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Product created.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin access only.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Admin access only.',
  })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Product information updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin access only.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Admin access only.',
  })
  @ApiResponse({ status: 404, description: 'Product or category not found.' })
  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(+id, dto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Product deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin access only.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Admin access only.',
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(+id);
  }
}
