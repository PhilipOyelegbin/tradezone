import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UploadedFiles,
  BadRequestException,
  Put,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseLogger, JwtGuard } from '../_config';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTooManyRequestsResponse({ description: 'Too Many Requests' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@UseInterceptors(CacheInterceptor)
@Controller('products')
export class ProductsController extends BaseLogger {
  constructor(private readonly productsService: ProductsService) {
    super(ProductsController.name);
  }

  @ApiOperation({
    summary: 'Create a new product',
    description: 'Creates a new product with up to 2 images.',
  })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(FilesInterceptor('images', 2))
  create(
    @Req() req: any,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
    @Body() dto: CreateProductDto,
  ) {
    if (!req.user?.is_admin) {
      this.logger.warn('User is not admin, forbidden to create category');
      throw new ForbiddenException('User not allowed to perform this action');
    }
    return this.productsService.create(files, dto);
  }

  @ApiOperation({
    summary: 'Get all products',
    description:
      'Retrieves a list of all products, optionally filtered by category.',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'price', required: false })
  @Get()
  findAll(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('category') category?: string,
    @Query('price') price?: string,
  ) {
    return this.productsService.findAll(page, pageSize, category, price);
  }

  @ApiOperation({
    summary: 'Get a product by ID',
    description: 'Retrieves the details of a specific product by its ID.',
  })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!id) {
      this.logger.warn('Product ID is missing in request parameters');
      throw new BadRequestException('Product ID is required');
    }

    return this.productsService.findOne(id);
  }

  @ApiOperation({
    summary: 'Update product images',
    description: 'Updates the images of a specific product by its ID.',
  })
  @ApiAcceptedResponse({ description: 'Accepted' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put('images/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  @UseInterceptors(FilesInterceptor('images', 2))
  updateImages(
    @Req() req: any,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({ fileType: 'image/*' }),
        ],
      }),
    )
    files: Array<Express.Multer.File>,
    @Param('id') id: string,
  ) {
    if (!req.user?.is_admin) {
      this.logger.warn('User is not admin, forbidden to create category');
      throw new ForbiddenException('User not allowed to perform this action');
    }
    if (!id) {
      this.logger.warn('Product ID is missing in request parameters');
      throw new BadRequestException('Product ID is required');
    }

    return this.productsService.updateImages(id, files);
  }

  @ApiOperation({
    summary: 'Update product details',
    description: 'Updates the details of a specific product by its ID.',
  })
  @ApiAcceptedResponse({ description: 'Accepted' })
  @ApiAcceptedResponse({ description: 'Accepted' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Put('details/:id')
  @HttpCode(HttpStatus.ACCEPTED)
  updateDetails(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    if (!req.user?.is_admin) {
      this.logger.warn('User is not admin, forbidden to create category');
      throw new ForbiddenException('User not allowed to perform this action');
    }
    if (!id) {
      this.logger.warn('Product ID is missing in request parameters');
      throw new BadRequestException('Product ID is required');
    }

    return this.productsService.updateDetails(id, dto);
  }

  @ApiOperation({
    summary: 'Delete a product',
    description: 'Deletes a specific product by its ID.',
  })
  @ApiNoContentResponse({ description: 'No Content' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: any, @Param('id') id: string) {
    if (!req.user?.is_admin) {
      this.logger.warn('User is not admin, forbidden to create category');
      throw new ForbiddenException('User not allowed to perform this action');
    }
    if (!id) {
      this.logger.warn('Product ID is missing in request parameters');
      throw new BadRequestException('Product ID is required');
    }

    return this.productsService.remove(id);
  }
}
