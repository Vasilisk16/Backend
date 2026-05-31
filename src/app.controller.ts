import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @ApiOkResponse({
    schema: {
      example: { status: 'ok' },
    },
  })
  healthCheck() {
    return { status: 'ok' };
  }
}
