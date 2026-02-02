import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
  ForbiddenException,
  Param,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto';
import { BaseLogger, JwtGuard } from '../_config';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { createHmac } from 'crypto';

@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('payments')
export class PaymentsController extends BaseLogger {
  constructor(private readonly paymentsService: PaymentsService) {
    super(PaymentsController.name);
  }

  @ApiOperation({
    summary: 'Create a new payment',
    description: 'Initialize a payment transaction for an order',
  })
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Created' })
  @UseGuards(JwtGuard)
  @Post()
  create(@Req() req: any, @Body() dto: CreatePaymentDto) {
    if (!req.user || !req.user.id) {
      this.logger.warn(`User ${req.user.id} is creating a payment`);
      throw new UnauthorizedException('Unauthorized user');
    }

    return this.paymentsService.create(dto);
  }

  @ApiOperation({
    summary: 'Get all payments',
    description: 'Retrieve a list of all payments (admin only)',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @UseGuards(JwtGuard)
  @Get()
  findAll(@Req() req: any) {
    if (!req.user || !req.user.is_admin) {
      this.logger.warn(
        `User ${req.user.id} is not allowed to access all payments`,
      );
      throw new ForbiddenException(
        'User is not allowed to access this resource',
      );
    }

    return this.paymentsService.findAll();
  }

  @ApiOperation({
    summary: 'List all transactions',
    description: 'List all transactions (admin only)',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @UseGuards(JwtGuard)
  @Get('list/:page/:perPage')
  listTransactions(
    @Req() req: any,
    @Param('page') page: number,
    @Param('perPage') perPage: number,
  ) {
    if (!req.user || !req.user.is_admin) {
      this.logger.warn(
        `User ${req.user.id} is not allowed to list transactions`,
      );
      throw new ForbiddenException(
        'User is not allowed to access this resource',
      );
    }

    return this.paymentsService.listTransactions(perPage, page);
  }

  @ApiOperation({
    summary: 'Confirm a payment',
    description: 'Confirm the status of a payment by its order ID (admin only)',
  })
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'OK' })
  @UseGuards(JwtGuard)
  @Get('verify/:order_id')
  confirmPayment(@Req() req: any, @Param('order_id') order_id: string) {
    if (!req.user || !req.user.is_admin) {
      this.logger.warn(`User ${req.user.id} is not allowed to confirm payment`);
      throw new ForbiddenException(
        'User is not allowed to access this resource',
      );
    }
    if (!order_id) {
      this.logger.warn(`Order ID is required to confirm payment`);
      throw new BadRequestException('Order ID is required');
    }

    return this.paymentsService.confirmPayment(order_id);
  }

  @ApiOperation({
    summary: 'Handle Paystack webhook events',
    description: 'Process incoming webhook events from Paystack',
  })
  @ApiOkResponse({ description: 'OK' })
  @Post('webhook')
  async webhookHandler(@Req() req: Request, @Res() res: any) {
    const secret = process.env.PAYSTACK_SECRET_KEY ?? '';
    const hash = createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash == req.headers['x-paystack-signature']) {
      const event = req.body;
      await this.paymentsService.processWebhookEvent(event);
    }

    res.status(HttpStatus.OK).send({ message: 'Webhook received' });
  }
}
