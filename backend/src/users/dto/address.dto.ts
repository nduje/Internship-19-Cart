import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export enum AddressType {
  DELIVERY = 'DELIVERY',
  BILLING = 'BILLING',
}

export class AddressDto {
  @ApiProperty({ example: 1, required: true })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'DELIVERY', required: true })
  @IsArray()
  @IsEnum(AddressType, { each: true })
  type: AddressType;

  @ApiProperty({ example: 'Pujanke 53', required: true })
  @IsString()
  street: string;

  @ApiProperty({ example: 'Split', required: true })
  @IsString()
  city: string;

  @ApiProperty({ example: '21000', required: true })
  @IsString()
  postalCode: string;

  @ApiProperty({ example: 'Croatia', required: true })
  @IsString()
  country: string;
}
