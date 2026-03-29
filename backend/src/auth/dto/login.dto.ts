import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@user.com',
    description: "User's Email",
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: "User's Password",
    required: true,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
