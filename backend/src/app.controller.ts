import { Controller, Get } from '@nestjs/common';
import { BaseLogger } from './_config';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { SeedService } from './_seed/seed.service';

@ApiOkResponse({ description: 'Ok' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller()
export class AppController extends BaseLogger {
  constructor(private readonly seedService: SeedService) {
    super(AppController.name);
  }

  @ApiOperation({
    summary: 'Health Check Endpoint',
    description: 'Returns the health status of the application.',
  })
  @Get('health')
  health() {
    return { message: 'API is healthy' };
  }

  async onModuleInit() {
    await this.seedService.seedAdministrator();
  }
}
