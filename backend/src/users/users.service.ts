import { Injectable } from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  find(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    });
  }

  async update(userId: number, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.email && { email: dto.email }),
        ...(dto.password && {
          password: await hash(dto.password, 10),
        }),
        ...(dto.addresses && {
          addresses: {
            update: dto.addresses.map((addr) => ({
              where: { id: addr.id },
              data: {
                type: addr.type,
                street: addr.street,
                city: addr.city,
                postalCode: addr.postalCode,
                country: addr.country,
              },
            })),
          },
        }),
      },
      include: { addresses: true },
    });
  }
}
