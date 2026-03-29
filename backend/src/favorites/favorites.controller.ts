import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({ status: 201, description: 'Product added to favorites.' })
  @ApiResponse({
    status: 400,
    description: 'Product is already in favorites list.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. User access only.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Post(':productId')
  create(@Param('productId', ParseIntPipe) productId: number, @Request() req) {
    const userId = req.user.id;
    return this.favoritesService.create(userId, productId);
  }

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User favorites retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. User access only.' })
  @Get()
  findAll(@Request() req) {
    const userId = req.user.id;
    return this.favoritesService.findAll(userId);
  }

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'productId', type: Number })
  @ApiResponse({ status: 200, description: 'Product removed from favorites.' })
  @ApiResponse({
    status: 400,
    description: 'Product does is not in favorites list.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized. User access only.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Delete(':productId')
  remove(@Param('productId', ParseIntPipe) productId: number, @Request() req) {
    const userId = req.user.id;
    return this.favoritesService.remove(userId, productId);
  }
}
