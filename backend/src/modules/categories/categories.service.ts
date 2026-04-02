import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (existingCategory) {
      throw new BadRequestException('Category already exists');
    }

    return this.prisma.category.create({ data: { name: dto.name } });
  }

  findAll() {
    return this.prisma.category.findMany({ include: { products: true } });
  }

  async findOne(id: number) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category)
      throw new NotFoundException(`Category with id ${id} not found`);

    return category;
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.category.delete({ where: { id } });
  }
}
