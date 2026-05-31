import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Landmark } from './landmark.entity.js';
import { LandmarksController } from './landmarks.controller.js';
import { LandmarksService } from './landmarks.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Landmark])],
  controllers: [LandmarksController],
  providers: [LandmarksService],
  exports: [LandmarksService],
})
export class LandmarksModule {}
