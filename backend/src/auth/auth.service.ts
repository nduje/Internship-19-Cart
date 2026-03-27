import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(RegisterDto: {
    name: string;
    email: string;
    password: string;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: RegisterDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hash(RegisterDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: RegisterDto.name,
        email: RegisterDto.email,
        password: hashedPassword,
      },
    });

    const payload = {
      id: user.id,
      isAdmin: user.isAdmin,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }

  async login(LoginDto: { email: string; password: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: LoginDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isPasswordValid = await compare(LoginDto.password, user.password);

    if (!isPasswordValid) {
      throw new ForbiddenException('Password not valid');
    }

    const payload = {
      id: user.id,
      isAdmin: user.isAdmin,
    };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
