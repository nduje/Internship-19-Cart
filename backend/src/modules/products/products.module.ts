import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma.module';
import { PrismaService } from 'src/config/prisma.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PrismaService],
  imports: [PrismaModule],
})
export class ProductsModule {}
