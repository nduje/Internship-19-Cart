import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    example: 'Streetwear',
    description: 'Name of the category',
    required: true,
  })
  @IsString()
  @MinLength(2)
  name: string;
}
