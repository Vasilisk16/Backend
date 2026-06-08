import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { withDbRetry } from '../common/db-retry.util.js';
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
    return withDbRetry(() =>
      this.eraRepository.find({ order: { sortOrder: 'ASC' } }),
    );
  }

  findAllCategories() {
    return withDbRetry(() =>
      this.categoryRepository.find({ order: { name: 'ASC' } }),
    );
  }
}
