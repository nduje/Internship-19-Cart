import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

export class UpdateOrderDto {
  @ApiProperty({
    example: 'CONFIRMED',
    description: 'Order Status',
    required: true,
  })
  @IsEnum(OrderStatus, { each: true })
  status: OrderStatus;
}
