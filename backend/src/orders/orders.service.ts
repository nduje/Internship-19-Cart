import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  findUserOrders() {
    return `This action returns the user's orders`;
  }

  create() {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all orders`;
  }

  update() {
    return `This action updates a order`;
  }
}
