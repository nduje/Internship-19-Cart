import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  EU_40 = 'EU_40',
  EU_41 = 'EU_41',
  EU_42 = 'EU_42',
  EU_43 = 'EU_43',
  EU_44 = 'EU_44',
  EU_45 = 'EU_45',
  EU_46 = 'EU_46',
}

export enum Color {
  RED = 'RED',
  BLUE = 'BLUE',
  GREEN = 'GREEN',
  BLACK = 'BLACK',
  WHITE = 'WHITE',
  YELLOW = 'YELLOW',
  ORANGE = 'ORANGE',
  PURPLE = 'PURPLE',
  PINK = 'PINK',
  BROWN = 'BROWN',
  GRAY = 'GRAY',
}

export class OrderItemDto {
  @ApiProperty({
    example: 1,
    description: 'Product Identification Number',
    required: true,
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    example: 'XL',
    description: 'Product Size',
    required: false,
  })
  @IsOptional()
  @IsEnum(Size, { each: true })
  size?: Size;

  @ApiProperty({
    example: 'BLACK',
    description: 'Product Color',
    required: false,
  })
  @IsOptional()
  @IsEnum(Color, { each: true })
  color?: Color;
}
