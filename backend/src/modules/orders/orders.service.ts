import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  findUserOrders(userId: number) {
    return this.prisma.order.findMany({
      where: { userId: userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async create(userId: number, dto: CreateOrderDto) {
    const addresses = await this.prisma.address.findMany({
      where: {
        userId,
      },
    });

    const deliveryAddress = addresses.find((a) => a.type === 'DELIVERY');
    const billingAddress = addresses.find((a) => a.type === 'BILLING');

    if (!deliveryAddress || !billingAddress) {
      throw new BadRequestException(
        'User must have both delivery and billing address',
      );
    }

    const productIds = dto.items.map((item) => item.productId);

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    const orderItemsData = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      return {
        productId: item.productId,
        price: product.price,
        size: item.size,
        color: item.color,
      };
    });

    const totalPrice = orderItemsData.reduce(
      (sum, item) => sum + item.price,
      0,
    );

    return this.prisma.order.create({
      data: {
        userId,
        deliveryAddressId: deliveryAddress.id,
        billingAddressId: billingAddress.id,
        totalPrice,
        items: {
          create: orderItemsData,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async update(id: number, dto: UpdateOrderDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }
}
