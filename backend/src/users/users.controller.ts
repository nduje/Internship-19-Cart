import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User information retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. User access only.' })
  @Get('me')
  find(@Request() req) {
    const userId = req.user.id;
    return this.usersService.find(userId);
  }

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'User information updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. User access only.' })
  @Put('me')
  update(@Body() dto: UpdateUserDto, @Request() req) {
    const userId = req.user.id;
    return this.usersService.update(userId, dto);
  }
}
