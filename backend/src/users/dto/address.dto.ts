import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsString } from 'class-validator';

export enum AddressType {
  DELIVERY = 'DELIVERY',
  BILLING = 'BILLING',
}

export class AddressDto {
  @ApiProperty({
    example: 1,
    description: 'Address Identification Number',
    required: true,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'DELIVERY',
    description: 'Address Type (DELIVERY | BILLING)',
    required: true,
  })
  @IsArray()
  @IsEnum(AddressType, { each: true })
  type: AddressType;

  @ApiProperty({
    example: 'Pujanke 53',
    description: 'Address Street',
    required: true,
  })
  @IsString()
  street: string;

  @ApiProperty({
    example: 'Split',
    description: 'Address City',
    required: true,
  })
  @IsString()
  city: string;

  @ApiProperty({
    example: '21000',
    description: 'Address Postal Code',
    required: true,
  })
  @IsString()
  postalCode: string;

  @ApiProperty({
    example: 'Croatia',
    description: 'Address Country',
    required: true,
  })
  @IsString()
  country: string;
}
