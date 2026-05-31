import { Injectable } from '@nestjs/common';
import { AdminResource, adminSchemaFromClassValidator } from 'nestjs-dj-admin';
import { LegalStatus } from '../references/entities/legal-status.entity.js';
import {
  CreateReferenceDto,
  UpdateReferenceDto,
} from './dto/reference-admin.dto.js';

@Injectable()
@AdminResource({
  model: LegalStatus,
  list: ['id', 'name'],
  search: ['name'],
  readonly: ['id'],
  schema: adminSchemaFromClassValidator({
    createDto: CreateReferenceDto,
    updateDto: UpdateReferenceDto,
  }),
})
export class LegalStatusAdmin {}
