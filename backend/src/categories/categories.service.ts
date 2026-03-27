import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  create() {
    return 'This action adds a new category';
  }

  findAll() {
    return `This action returns all categories`;
  }

  remove() {
    return `This action removes a category`;
  }
}
