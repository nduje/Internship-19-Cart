import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma.module';
import { PrismaService } from 'src/config/prisma.service';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, PrismaService],
  imports: [PrismaModule],
})
export class FavoritesModule {}
