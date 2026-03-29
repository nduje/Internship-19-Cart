import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @ApiProperty({
    example: 'Tonći Huljić',
    description: "User's Name",
    required: true,
  })
  @IsString()
  @MinLength(2)
  name: string;
}
