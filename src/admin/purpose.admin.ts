import { Injectable } from '@nestjs/common';
import { AdminResource, adminSchemaFromClassValidator } from 'nestjs-dj-admin';
import { Purpose } from '../references/entities/purpose.entity.js';
import {
  CreateReferenceDto,
  UpdateReferenceDto,
} from './dto/reference-admin.dto.js';

@Injectable()
@AdminResource({
  model: Purpose,
  list: ['id', 'name'],
  search: ['name'],
  readonly: ['id'],
  schema: adminSchemaFromClassValidator({
    createDto: CreateReferenceDto,
    updateDto: UpdateReferenceDto,
  }),
})
export class PurposeAdmin {}
