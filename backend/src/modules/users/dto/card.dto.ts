import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

export class CardDto {
  @ApiProperty({
    example: 'HR1210010051863000160',
    description: 'IBAN number',
    required: true,
  })
  @IsString()
  iban: string;

  @ApiProperty({
    example: '12/27',
    description: 'Card expiration date (MM/YY)',
    required: true,
  })
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/\d{2}$/)
  expiration: string;

  @ApiProperty({
    example: '123',
    description: 'Card ISCT code (3 digits)',
    required: true,
  })
  @IsString()
  @Length(3, 3)
  isct: string;
}
