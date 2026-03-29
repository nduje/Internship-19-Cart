import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/config/prisma.module';
import { PrismaService } from 'src/config/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService],
  imports: [PrismaModule],
})
export class UsersModule {}
