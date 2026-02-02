import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { BaseLogger } from '../_config';
import { CreatePaymentDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService extends BaseLogger {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {
    super(PaymentsService.name);
  }

  async create(dto: CreatePaymentDto) {
    const existingOrder = await this.orderRepo.findOne({
      where: { id: dto.order_id },
    });
    if (!existingOrder) {
      this.logger.warn(`Order with ID ${dto.order_id} not found`);
      throw new NotFoundException('Order not found');
    }
    if (!existingOrder.status.includes('Pending')) {
      this.logger.warn(`Order with ID ${dto.order_id} is not payable`);
      throw new BadRequestException('Order is not payable');
    }

    const response = await fetch(
      'https://api.paystack.co/transaction/initialize',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: existingOrder.user.email,
          amount: existingOrder.payment_info.amount * 100,
          reference: existingOrder.id,
          currency: 'NGN',
          channels: [dto.method.toLowerCase()],
          callback_url: process.env.PAYSTACK_CALLBACK_URL,
          metadata: {
            orderId: existingOrder.id,
            userId: existingOrder.user.id,
            cancel_action: process.env.CLIENT_URL,
          },
        }),
      },
    );

    const result = await response.json();
    if (!response.ok) {
      this.logger.error(`Paystack init failed: ${result.message}`);
      throw new InternalServerErrorException('Failed to initialize payment');
    }

    const newPayment = this.paymentRepo.create({
      ...dto,
      amount: existingOrder.payment_info.amount,
      status: 'Initialized',
      user: existingOrder.user,
      order: existingOrder,
    });
    await this.paymentRepo.save(newPayment);
    return {
      message: 'Payment initialized successfully',
      data: result.data,
    };
  }

  async findAll() {
    const payments = await this.paymentRepo.find({
      relations: ['user', 'order'],
    });
    return { message: 'Payments fetched successfully', data: payments };
  }

  async listTransactions(perPage: number, page: number) {
    const response = await fetch(
      `https://api.paystack.co/transaction?page=${page}&perPage=${perPage}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const result = await response.json();
    if (!response.ok) {
      this.logger.error(`Paystack list failed: ${result.message}`);
      throw new InternalServerErrorException('Failed to list payment');
    }

    return result;
  }

  async confirmPayment(order_id: string) {
    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${order_id}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const result = await response.json();
    if (!response.ok) {
      this.logger.error(`Paystack verify failed: ${result.message}`);
      throw new InternalServerErrorException('Failed to verify payment');
    }

    return result;
  }

  async processWebhookEvent(payload: any) {
    this.logger.log(`Received event: ${payload.event}`);
    const transactionRef = payload.data.reference;
    const existingPayment = await this.paymentRepo.findOne({
      where: { order: { id: transactionRef } },
    });
    if (!existingPayment) {
      this.logger.warn(`Payment with reference ${transactionRef} not found`);
      throw new NotFoundException('Payment not found');
    }

    const successfulPayment = this.paymentRepo.create({
      ...existingPayment,
      status: 'Completed',
    });

    const failedPayment = this.paymentRepo.create({
      ...existingPayment,
      status: 'Completed',
    });

    switch (payload.event) {
      case 'charge.success':
        this.logger.log(
          `Handling successful charge for reference: ${transactionRef}`,
        );
        await this.paymentRepo.save(successfulPayment);
        break;
      case 'transfer.success':
        this.logger.log(
          `Handling successful transfer for reference: ${transactionRef}`,
        );
        await this.paymentRepo.save(successfulPayment);
        break;
      case 'paymentrequest.success':
        this.logger.log(
          `Handling successful payment for reference: ${transactionRef}`,
        );
        await this.paymentRepo.save(successfulPayment);
        break;
      case 'transfer.failed':
        this.logger.log(
          `Handling failed transfer for reference: ${transactionRef}`,
        );
        await this.paymentRepo.save(failedPayment);
        break;
      case 'transfer.reversed':
        this.logger.log(
          `Handling reversed transfer for reference: ${transactionRef}`,
        );
        await this.paymentRepo.save(failedPayment);
        break;
      default:
        this.logger.log(`Unhandled event type: ${payload.event}`);
    }
  }
}
