import { Injectable } from '@nestjs/common';
import { AdminResource, adminSchemaFromClassValidator } from 'nestjs-dj-admin';
import { Era } from '../references/entities/era.entity.js';
import {
  CreateEraDto,
  UpdateEraDto,
} from './dto/reference-admin.dto.js';

@Injectable()
@AdminResource({
  model: Era,
  list: ['id', 'name', 'sortOrder'],
  search: ['name'],
  filters: ['sortOrder'],
  readonly: ['id'],
  schema: adminSchemaFromClassValidator({
    createDto: CreateEraDto,
    updateDto: UpdateEraDto,
  }),
})
export class EraAdmin {}
