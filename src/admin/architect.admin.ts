import { Injectable } from '@nestjs/common';
import { AdminResource, adminSchemaFromClassValidator } from 'nestjs-dj-admin';
import { Architect } from '../references/entities/architect.entity.js';
import {
  CreateReferenceDto,
  UpdateReferenceDto,
} from './dto/reference-admin.dto.js';

@Injectable()
@AdminResource({
  model: Architect,
  list: ['id', 'name'],
  search: ['name'],
  readonly: ['id'],
  schema: adminSchemaFromClassValidator({
    createDto: CreateReferenceDto,
    updateDto: UpdateReferenceDto,
  }),
})
export class ArchitectAdmin {}
