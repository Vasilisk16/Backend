import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Landmark } from '../landmarks/landmark.entity.js';
import { Architect } from '../references/entities/architect.entity.js';
import { Category } from '../references/entities/category.entity.js';
import { Era } from '../references/entities/era.entity.js';
import { LegalStatus } from '../references/entities/legal-status.entity.js';
import { Purpose } from '../references/entities/purpose.entity.js';
import { Style } from '../references/entities/style.entity.js';
import { SeedService } from './seed.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Era,
      Category,
      Style,
      Architect,
      Purpose,
      LegalStatus,
      Landmark,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
