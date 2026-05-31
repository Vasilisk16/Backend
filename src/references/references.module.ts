import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Architect } from './entities/architect.entity.js';
import { Category } from './entities/category.entity.js';
import { Era } from './entities/era.entity.js';
import { LegalStatus } from './entities/legal-status.entity.js';
import { Purpose } from './entities/purpose.entity.js';
import { Style } from './entities/style.entity.js';
import { ReferencesController } from './references.controller.js';
import { ReferencesService } from './references.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Era,
      Category,
      Style,
      Architect,
      Purpose,
      LegalStatus,
    ]),
  ],
  controllers: [ReferencesController],
  providers: [ReferencesService],
  exports: [TypeOrmModule],
})
export class ReferencesModule {}
