import { Injectable } from '@nestjs/common';

@Injectable()
export class FavoritesService {
  findAll() {
    return `This action returns all favorites`;
  }

  create() {
    return 'This action adds a new favorite';
  }

  remove() {
    return `This action removes a favorite`;
  }
}
