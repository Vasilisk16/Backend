import { Injectable } from '@nestjs/common';
import { AdminResource, adminSchemaFromClassValidator } from 'nestjs-dj-admin';
import { Landmark } from '../landmarks/landmark.entity.js';
import { CreateLandmarkDto, UpdateLandmarkDto } from './dto/landmark-admin.dto.js';

@Injectable()
@AdminResource({
  model: Landmark,
  list: [
    'slug',
    'title',
    'yearOfConstruction',
    'address',
    'eraId',
    'styleId',
    'createdAt',
  ],
  listDisplayLinks: ['slug'],
  search: ['title', 'shortDescription', 'address', 'slug'],
  readonly: ['createdAt', 'updatedAt'],
  schema: adminSchemaFromClassValidator({
    createDto: CreateLandmarkDto,
    updateDto: UpdateLandmarkDto,
  }),
})
export class LandmarkAdmin {}
