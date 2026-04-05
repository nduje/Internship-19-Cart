import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { AddressDto } from './address.dto';
import { CardDto } from './card.dto';

export class UpdateUserDto {
  @ApiProperty({
    type: [AddressDto],
    description: "User's Addresses (DELIVERY | BILLING)",
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddressDto)
  addresses?: AddressDto[];

  @ApiProperty({
    type: CardDto,
    description: "User's Card",
    required: false,
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CardDto)
  card?: CardDto;
}
