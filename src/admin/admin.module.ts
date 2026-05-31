import { Module } from '@nestjs/common';
import { ArchitectAdmin } from './architect.admin.js';
import { CategoryAdmin } from './category.admin.js';
import { EraAdmin } from './era.admin.js';
import { LandmarkAdmin } from './landmark.admin.js';
import { LegalStatusAdmin } from './legal-status.admin.js';
import { PurposeAdmin } from './purpose.admin.js';
import { StyleAdmin } from './style.admin.js';

@Module({
  providers: [
    LandmarkAdmin,
    EraAdmin,
    CategoryAdmin,
    StyleAdmin,
    ArchitectAdmin,
    PurposeAdmin,
    LegalStatusAdmin,
  ],
})
export class AdminProvidersModule {}
