import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { Era } from './entities/era.entity.js';

@Injectable()
export class ReferencesService {
  constructor(
    @InjectRepository(Era)
    private readonly eraRepository: Repository<Era>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  findAllEras() {
    return this.eraRepository.find({ order: { sortOrder: 'ASC' } });
  }

  findAllCategories() {
    return this.categoryRepository.find({ order: { name: 'ASC' } });
  }
}
