import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  HttpStatus,
  HttpCode,
  UseGuards,
  ForbiddenException,
  Put,
  BadRequestException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { BaseLogger, JwtGuard } from '../_config';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import {
  ApiAcceptedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@UseGuards(JwtGuard)
@Controller('orders')
export class OrdersController extends BaseLogger {
  constructor(private readonly ordersService: OrdersService) {
    super(OrdersController.name);
  }

  @ApiOperation({
    summary: 'Create a new order',
    description: 'Creates a new order for the authenticated user.',
  })
  @ApiCreatedResponse({ description: 'Created.' })
  @Post()
  create(@Req() req: any, @Body() dto: CreateOrderDto) {
    if (!req.user || !req.user.id) {
      this.logger.warn('Unauthorized access attempt to create order');
      throw new UnauthorizedException('Unauthorized');
    }

    return this.ordersService.create(req.user.id, dto);
  }

  @ApiOperation({
    summary: 'Get all orders for the authenticated user',
    description: 'Retrieves all orders associated with the authenticated user.',
  })
  @ApiOkResponse({ description: 'OK.' })
  @Get()
  findAll(@Req() req: any) {
    if (!req.user || !req.user.id) {
      this.logger.warn('Unauthorized access attempt to get orders');
      throw new UnauthorizedException('Unauthorized');
    }

    return this.ordersService.findAll(req.user.id);
  }

  @ApiOperation({
    summary: 'Get a specific order by ID',
    description:
      'Retrieves a specific order by its ID for the authenticated user.',
  })
  @ApiOkResponse({ description: 'OK.' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Get(':id')
  findOne(@Req() req: any, @Param('id') id: string) {
    if (!id) {
      this.logger.warn('Bad request: Order ID is missing');
      throw new BadRequestException('Order ID must be provided');
    }
    if (!req.user || !req.user.id) {
      this.logger.warn('Unauthorized access attempt to get order');
      throw new UnauthorizedException('Unauthorized');
    }

    return this.ordersService.findOne(id, req.user.id);
  }

  @ApiOperation({
    summary: 'Update an order by ID',
    description: 'Updates a specific order by its ID as admin.',
  })
  @ApiAcceptedResponse({ description: 'Accepted' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
  ) {
    if (!id) {
      this.logger.warn('Bad request: Order ID is missing');
      throw new BadRequestException('Order ID must be provided');
    }
    if (!req.user.is_admin) {
      this.logger.warn('Forbidden access attempt to update order');
      throw new ForbiddenException('Forbidden');
    }

    return this.ordersService.update(id, dto);
  }

  @ApiOperation({
    summary: 'Cancel an order by ID',
    description:
      'Cancels a specific order by its ID for the authenticated user.',
  })
  @ApiNoContentResponse({ description: 'No Content.' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Req() req: any, @Param('id') id: string) {
    if (!id) {
      this.logger.warn('Bad request: Order ID is missing');
      throw new BadRequestException('Order ID must be provided');
    }
    if (!req.user || !req.user.id) {
      this.logger.warn('Unauthorized access attempt to cancel order');
      throw new UnauthorizedException('Unauthorized');
    }

    return this.ordersService.remove(id, req.user.id);
  }
}
