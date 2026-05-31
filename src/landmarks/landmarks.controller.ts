import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
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

  @Get(':id')
  @ApiOkResponse({ description: 'Детальная информация о достопримечательности' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.landmarksService.findOne(id);
  }
}
