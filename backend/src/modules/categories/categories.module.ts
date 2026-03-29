import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma.module';
import { PrismaService } from 'src/config/prisma.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService],
  imports: [PrismaModule],
})
export class CategoriesModule {}
