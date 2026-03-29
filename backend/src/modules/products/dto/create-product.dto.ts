import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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

export class CreateProductDto {
  @ApiProperty({
    example: "Men's T-Shirt",
    description: 'Product Name',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Sportswear made for high-performance training.',
    description: 'Product Description',
    required: true,
  })
  @IsString()
  description: string;

  @ApiProperty({
    example: 19.99,
    description: 'Product Price',
    required: true,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    example: 'Nike',
    description: 'Product Brand',
    required: true,
  })
  @IsString()
  brand: string;

  @ApiProperty({
    example: true,
    description: 'Product Stock Status',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;

  @ApiProperty({
    example:
      'https://cdn.aboutstatic.com/file/images/ad3123dba0c9801639ee80248090d94a.png?bg=F4F4F5&quality=75&trim=1&height=1280&width=960',
    description: 'Product Image',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    example: ['S', 'M', 'L', 'XL'],
    description: 'Product Sizes',
    required: true,
  })
  @IsArray()
  @IsEnum(Size, { each: true })
  sizes: Size[];

  @ApiProperty({
    example: ['BLACK', 'WHITE'],
    description: 'Product Colors',
    required: true,
  })
  @IsArray()
  @IsEnum(Color, { each: true })
  colors: Color[];

  @ApiProperty({
    example: 1,
    description: 'Product Category Identification Number',
    required: true,
  })
  @IsNumber()
  categoryId: number;
}
