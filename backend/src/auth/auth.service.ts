import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register() {
    return 'This action registers a new user';
  }

  login() {
    return 'This action logs in a user';
  }
}
