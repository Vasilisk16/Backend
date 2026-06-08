import { Injectable } from '@nestjs/common';
import { AdminResource, adminSchemaFromClassValidator } from 'nestjs-dj-admin';
import { Landmark } from '../landmarks/landmark.entity.js';
import { CreateLandmarkDto, UpdateLandmarkDto } from './dto/landmark-admin.dto.js';

@Injectable()
@AdminResource({
  model: Landmark,
  list: [
    'id',
    'title',
    'yearOfConstruction',
    'address',
    'eraId',
    'styleId',
    'categories',
    'createdAt',
  ],
  listDisplayLinks: ['id'],
  search: ['title', 'shortDescription', 'address', 'id'],
  readonly: ['createdAt', 'updatedAt'],
  schema: adminSchemaFromClassValidator({
    createDto: CreateLandmarkDto,
    updateDto: UpdateLandmarkDto,
  }),
})
export class LandmarkAdmin {}
