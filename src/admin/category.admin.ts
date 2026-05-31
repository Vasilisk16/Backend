import { Injectable } from '@nestjs/common';
import { AdminResource, adminSchemaFromClassValidator } from 'nestjs-dj-admin';
import { Category } from '../references/entities/category.entity.js';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/reference-admin.dto.js';

@Injectable()
@AdminResource({
  model: Category,
  list: ['id', 'name', 'slug'],
  search: ['name', 'slug'],
  filters: ['slug'],
  readonly: ['id'],
  schema: adminSchemaFromClassValidator({
    createDto: CreateCategoryDto,
    updateDto: UpdateCategoryDto,
  }),
})
export class CategoryAdmin {}
