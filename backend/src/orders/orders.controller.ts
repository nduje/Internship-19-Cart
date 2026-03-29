import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminAuthGuard } from 'src/auth/admin-auth.guard';
import { UserAuthGuard } from 'src/auth/user-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: "User's orders retrieved." })
  @ApiResponse({ status: 401, description: 'Unauthorized. User access only.' })
  @Get('my')
  findUserOrders(@Request() req) {
    const userId = req.user.id;
    return this.ordersService.findUserOrders(userId);
  }

  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Order created.' })
  @ApiResponse({ status: 400, description: 'User addresses are incomplete.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. User access only.' })
  @ApiResponse({ status: 404, description: 'Product(s) not found.' })
  @Post()
  create(@Body() dto: CreateOrderDto, @Request() req) {
    const userId = req.user.id;
    return this.ordersService.create(userId, dto);
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Orders retrieved.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin access only.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Admin access only.',
  })
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AdminAuthGuard)
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Order status updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized. Admin access only.' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden access. Admin access only.',
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @Patch(':id/status')
  update(@Body() dto: UpdateOrderDto, @Param('id', ParseIntPipe) id: number) {
    return this.ordersService.update(id, dto);
  }
}
