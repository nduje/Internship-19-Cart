import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './address.dto';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Tonći Huljić',
    description: "User's Name",
    required: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({
    example: 'user@user.com',
    description: "User's Email",
    required: true,
  })
  @IsOptional()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: "User's Password",
    required: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    type: [AddressDto],
    description: "User's Addresses (DELIVERY | BILLING)",
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];
}
