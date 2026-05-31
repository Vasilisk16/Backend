import { Injectable } from '@nestjs/common';
import { AdminResource, adminSchemaFromClassValidator } from 'nestjs-dj-admin';
import { Style } from '../references/entities/style.entity.js';
import {
  CreateReferenceDto,
  UpdateReferenceDto,
} from './dto/reference-admin.dto.js';

@Injectable()
@AdminResource({
  model: Style,
  list: ['id', 'name'],
  search: ['name'],
  readonly: ['id'],
  schema: adminSchemaFromClassValidator({
    createDto: CreateReferenceDto,
    updateDto: UpdateReferenceDto,
  }),
})
export class StyleAdmin {}
