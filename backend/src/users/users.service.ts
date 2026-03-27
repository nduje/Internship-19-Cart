import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  find() {
    return `This action returns a user`;
  }

  update() {
    return `This action updates a user`;
  }
}
