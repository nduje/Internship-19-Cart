import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters?: {
    search?: string;
    category?: string;
    sort?: string;
    inStock?: boolean;
    page?: number;
    limit?: number;
  }) {
    const {
      search,
      sort,
      category,
      inStock,
      page = 1,
      limit = 10,
    } = filters || {};

    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    if (category) {
      where.category = { name: category };
    }

    if (inStock !== undefined) {
      where.inStock = inStock;
    }

    let orderBy: any[] = [{ id: 'asc' }];

    if (sort) {
      const [field, direction] = sort.split('-');
      orderBy = [
        {
          [field]: direction?.toLowerCase() === 'desc' ? 'desc' : 'asc',
        },
      ];
    }

    const total = await this.prisma.product.count({ where });

    const items = await this.prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        brand: dto.brand,
        inStock: dto.inStock ?? true,
        image: dto.image,
        sizes: dto.sizes,
        colors: dto.colors,
        categoryId: dto.categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.product.delete({ where: { id } });
  }
}
