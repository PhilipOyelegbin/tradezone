import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseLogger } from '../_config';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class OrdersService extends BaseLogger {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    private dataSource: DataSource,
  ) {
    super(OrdersService.name);
  }

  async create(userId: string, dto: CreateOrderDto) {
    return await this.dataSource.transaction(async (manager) => {
      let totalPrice = 0;
      for (const cartItem of dto.carts) {
        const productId = cartItem?.product_id;
        const quantityToReduce = cartItem.quantity;

        const productInDb = await manager.findOne(Product, {
          where: { id: productId },
          select: ['id', 'quantity', 'price'],
          lock: { mode: 'pessimistic_write' },
        });

        if (!productInDb) {
          this.logger.warn(`Product with ID ${productId} not found`);
          throw new BadRequestException(
            `Product with ID ${productId} not found.`,
          );
        }

        if (productInDb.quantity < quantityToReduce) {
          this.logger.warn(`Insufficient stock for product ${productId}`);
          throw new BadRequestException(
            `Insufficient stock for product ${productId}. Available: ${productInDb.quantity}`,
          );
        }

        await manager.decrement(
          Product,
          { id: productId },
          'quantity',
          quantityToReduce,
        );

        const price = productInDb.price * quantityToReduce;
        totalPrice += price;
        await manager.delete(Cart, { product: { id: cartItem.product_id } });
      }

      const newOrder = manager.create(Order, {
        ...dto,
        user: { id: userId },
        payment_info: {
          provider: 'Paystack',
          amount: totalPrice,
        },
      });
      const savedOrder = await manager.save(newOrder);

      return {
        message: 'Order created successfully',
        data: savedOrder,
      };
    });
  }

  async findAll(userId: string) {
    const response = await this.orderRepo.find({
      where: { user: { id: userId } },
    });
    return {
      message: 'Orders retrieved successfully',
      data: response,
      count: response.length,
    };
  }

  async findOne(id: string, userId: string) {
    const response = await this.orderRepo.findOne({
      where: { id, user: { id: userId } },
    });
    if (!response) {
      this.logger.warn(`Order with ID ${id} not found for user ${userId}`);
      throw new NotFoundException('Order not found');
    }

    return { message: 'Order retrieved successfully', data: response };
  }

  async update(id: string, dto: UpdateOrderDto) {
    const order = await this.orderRepo.findOneBy({ id });
    if (!order) {
      this.logger.warn(`Order with ID ${id} not found for update`);
      throw new NotFoundException('Order not found');
    }

    Object.assign(order, dto);
    const response = await this.orderRepo.save(order);
    return { message: 'Order updated successfully', data: response };
  }

  async remove(id: string, userId: string) {
    return await this.dataSource.transaction(async (manager) => {
      const order = await manager.findOne(Order, {
        where: { id, user: { id: userId } },
      });
      if (!order) {
        this.logger.warn(`Order with ID ${id} not found for user ${userId}`);
        throw new NotFoundException('Order not found');
      }

      const status = Array.isArray(order.status)
        ? order.status[0]
        : order.status;

      if (['Shipped', 'Delivered'].includes(status)) {
        this.logger.warn(
          `Order with ID ${id} cannot be cancelled as it is already ${status}`,
        );
        throw new BadRequestException(
          'Order cannot be cancelled as it is already shipped/delivered.',
        );
      }

      if (status === 'Cancelled') {
        this.logger.warn(`Order with ID ${id} is already cancelled`);
        throw new BadRequestException('Order is already cancelled.');
      }

      for (const item of order.carts) {
        const productId = item?.product_id;
        await manager.increment(
          Product,
          { id: productId },
          'quantity',
          item.quantity,
        );
      }

      await manager.remove(order);
      return { message: 'Order cancelled and stock restocked successfully' };
    });
  }
}
