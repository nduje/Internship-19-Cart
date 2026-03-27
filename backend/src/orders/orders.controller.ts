import { Controller, Get, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('my')
  findUserOrders() {
    return this.ordersService.findUserOrders();
  }

  @Post()
  create() {
    return this.ordersService.create();
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Patch(':id')
  update() {
    return this.ordersService.update();
  }
}
