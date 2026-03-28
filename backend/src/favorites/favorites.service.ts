import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { product: true },
    });
  }

  async findProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException('Product not found');

    return product;
  }

  async findFavorite(userId: number, productId: number, isCreated: boolean) {
    const favorite = await this.prisma.favorite.findFirst({
      where: { userId, productId },
    });

    if (favorite && isCreated)
      throw new BadRequestException('Product is already in favorites list');
    else if (!favorite && !isCreated)
      throw new BadRequestException('Product is not in favorites list');

    return favorite;
  }

  async create(userId: number, productId: number) {
    await this.findProduct(productId);

    await this.findFavorite(userId, productId, true);

    return this.prisma.favorite.create({
      data: { userId, productId },
    });
  }

  async remove(userId: number, productId: number) {
    await this.findProduct(productId);

    await this.findFavorite(userId, productId, false);

    return this.prisma.favorite.deleteMany({
      where: { userId, productId },
    });
  }
}
