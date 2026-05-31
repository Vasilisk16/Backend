import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ReferencesService } from './references.service.js';

@ApiTags('references')
@Controller()
export class ReferencesController {
  constructor(private readonly referencesService: ReferencesService) {}

  @Get('eras')
  @ApiOkResponse({ description: 'Список эпох для фильтров' })
  findAllEras() {
    return this.referencesService.findAllEras();
  }

  @Get('categories')
  @ApiOkResponse({ description: 'Список категорий для фильтров' })
  findAllCategories() {
    return this.referencesService.findAllCategories();
  }
}
