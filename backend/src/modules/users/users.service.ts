import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  find(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true, card: true },
    });
  }

  async update(userId: number, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
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
        ...(dto.card && {
          card: {
            upsert: {
              create: {
                iban: dto.card.iban,
                expiration: dto.card.expiration,
                isct: dto.card.isct,
              },
              update: {
                ...(dto.card.iban && { iban: dto.card.iban }),
                ...(dto.card.expiration && {
                  expiration: dto.card.expiration,
                }),
                ...(dto.card.isct && { isct: dto.card.isct }),
              },
            },
          },
        }),
      },
      include: { addresses: true, card: true },
    });
  }
}
