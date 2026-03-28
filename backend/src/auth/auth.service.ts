import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        addresses: {
          create: [
            {
              type: 'DELIVERY',
              street: '',
              city: '',
              postalCode: '',
              country: '',
            },
            {
              type: 'BILLING',
              street: '',
              city: '',
              postalCode: '',
              country: '',
            },
          ],
        },
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

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isPasswordValid = await compare(dto.password, user.password);

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
