import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  Req,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseLogger, JwtGuard } from '../_config';

@Controller('categories')
export class CategoriesController extends BaseLogger {
  constructor(private readonly categoriesService: CategoriesService) {
    super(CategoriesController.name);
  }

  @ApiOperation({
    summary: 'Create a new category',
    description: 'Add a new category to the system',
  })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreateCategoryDto) {
    if (!req.user.is_admin) {
      this.logger.warn('User is not admin, forbidden to create category');
      throw new ForbiddenException(
        'User is not allowed to perform this action',
      );
    }
    if (!dto.name) {
      this.logger.warn('Missing category name in request body');
      throw new BadRequestException('Name is required');
    }

    return this.categoriesService.create(dto);
  }

  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieve a list of all categories',
  })
  @ApiOkResponse({ description: 'Ok' })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiOperation({
    summary: 'Get a category by ID',
    description: 'Retrieve a single category using its ID',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!id) {
      this.logger.warn('Missing category ID in request parameters');
      throw new BadRequestException('Category ID is required');
    }

    return this.categoriesService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update a category',
    description: 'Update the details of an existing category',
  })
  @ApiAcceptedResponse({ description: 'Updated' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    if (!req.user.is_admin) {
      this.logger.warn('User is not admin, forbidden to create category');
      throw new ForbiddenException(
        'User is not allowed to perform this action',
      );
    }
    if (!id) {
      this.logger.warn('Missing category ID in request parameters');
      throw new BadRequestException('Category ID is required');
    }

    return this.categoriesService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Delete a category',
    description: 'Remove a category from the system',
  })
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: any, @Param('id') id: string) {
    if (!req.user.is_admin) {
      this.logger.warn('User is not admin, forbidden to create category');
      throw new ForbiddenException(
        'User is not allowed to perform this action',
      );
    }
    if (!id) {
      this.logger.warn('Missing category ID in request parameters');
      throw new BadRequestException('Category ID is required');
    }

    return this.categoriesService.remove(id);
  }
}
