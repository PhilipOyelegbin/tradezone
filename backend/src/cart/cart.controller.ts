import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  BadRequestException,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto, UpdateCartDto } from './dto';
import { BaseLogger, JwtGuard } from '../_config';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@UseGuards(JwtGuard)
@Controller('cart')
export class CartController extends BaseLogger {
  constructor(private readonly cartService: CartService) {
    super(CartController.name);
  }

  @ApiOperation({ summary: 'Create Cart', description: 'Create a new cart' })
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  create(@Req() req: any, @Body() dto: CreateCartDto) {
    const { product_id, quantity } = dto;
    if (!product_id || quantity === undefined) {
      this.logger.warn('Missing required fields');
      throw new BadRequestException('All fields are required');
    }
    if (!req?.user?.id) {
      this.logger.warn('Missing user ID in request');
      throw new UnauthorizedException('User not authorized');
    }

    return this.cartService.create(dto, req.user.id);
  }

  @ApiOperation({ summary: 'Get All Carts', description: 'Retrieve all carts' })
  @ApiOkResponse({ description: 'Ok' })
  @Get()
  findAll(@Req() req: any) {
    if (!req?.user.id) {
      this.logger.warn('Missing user ID in request');
      throw new BadRequestException('User ID is required');
    }
    return this.cartService.findAll(req?.user.id);
  }

  @ApiOperation({ summary: 'Get Cart', description: 'Retrieve a cart by ID' })
  @ApiOkResponse({ description: 'Ok' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    if (!id) {
      this.logger.warn('Missing cart ID parameter');
      throw new BadRequestException('ID parameter is required');
    }

    return this.cartService.findOne(id);
  }

  @ApiOperation({ summary: 'Update Cart', description: 'Update a cart by ID' })
  @ApiAcceptedResponse({ description: 'Updated' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateCartDto) {
    if (!id) {
      this.logger.warn('Missing cart ID parameter');
      throw new BadRequestException('ID parameter is required');
    }
    if (!req?.user?.id) {
      this.logger.warn('Missing user ID in request');
      throw new UnauthorizedException('User not authorized');
    }

    return this.cartService.update(id, req.user.id, dto);
  }

  @ApiOperation({ summary: 'Delete Cart', description: 'Delete a cart by ID' })
  @ApiNoContentResponse({ description: 'Deleted' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: any, @Param('id') id: string) {
    if (!id) {
      this.logger.warn('Missing cart ID parameter');
      throw new BadRequestException('ID parameter is required');
    }
    if (!req?.user?.id) {
      this.logger.warn('Missing user ID in request');
      throw new UnauthorizedException('User not authorized');
    }

    return this.cartService.remove(id, req.user.id);
  }
}
