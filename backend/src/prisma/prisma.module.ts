import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService, ConfigService],
  exports: [PrismaService],
  imports: [ConfigModule],
})
export class PrismaModule {}
