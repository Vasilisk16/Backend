import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FindLandmarksQueryDto } from './dto/find-landmarks-query.dto.js';
import { LandmarksService } from './landmarks.service.js';

@ApiTags('landmarks')
@Controller('landmarks')
export class LandmarksController {
  constructor(private readonly landmarksService: LandmarksService) {}

  @Get()
  @ApiOkResponse({ description: 'Список достопримечательностей с фильтрами' })
  findAll(@Query() query: FindLandmarksQueryDto) {
    return this.landmarksService.findAll(query);
  }

  @Get(':slug')
  @ApiOkResponse({ description: 'Детальная информация о достопримечательности' })
  findOne(@Param('slug') slug: string) {
    return this.landmarksService.findOne(slug);
  }
}
