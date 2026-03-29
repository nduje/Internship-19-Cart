import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma.module';
import { PrismaService } from 'src/config/prisma.service';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, PrismaService],
  imports: [PrismaModule],
})
export class OrdersModule {}
