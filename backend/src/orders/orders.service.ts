import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseLogger } from 'src/_config';
import { CreateOrderDto, UpdateOrderDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, MoreThan } from 'typeorm';
import { Cart } from 'src/cart/entities/cart.entity';
import { Product } from 'src/products/entities/product.entity';

@Injectable()
export class OrdersService extends BaseLogger {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {
    super(OrdersService.name);
  }

  async create(userId: string, dto: CreateOrderDto) {
    const existingCart = await this.cartRepo.findOne({
      where: { id: dto.cart_id },
      relations: ['product', 'user'],
    });
    if (!existingCart) {
      this.logger.warn(`Cart with ID ${dto.cart_id} not found for order`);
      throw new NotFoundException('Cart not found');
    }

    const verifyProduct = await this.productRepo.findOne({
      where: {
        id: existingCart.product.id,
        quantity: MoreThan(existingCart.quantity),
      },
    });
    if (!verifyProduct) {
      this.logger.warn('Insufficient stock for order');
      throw new NotFoundException('Insufficient stock for order');
    }

    const newOrder = this.orderRepo.create({
      ...dto,
      user: { id: userId },
      cart: { id: dto.cart_id },
      payment_info: {
        provider: 'Paystack',
        amount: existingCart.quantity * verifyProduct.price,
      },
    });
    const order = this.orderRepo.save(newOrder);
    const deductQuantity = this.productRepo.update(verifyProduct.id, {
      quantity: verifyProduct.quantity - existingCart.quantity,
    });
    const response = await Promise.all([order, deductQuantity]);
    return { message: 'Order created successfully', data: response };
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
    const order = await this.orderRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['cart', 'cart.product'],
    });
    if (!order) {
      this.logger.warn(`Order with ID ${id} not found for user ${userId}`);
      throw new NotFoundException('Order not found');
    }

    if (
      order.status.includes('Shipped') ||
      order.status.includes('Delivered')
    ) {
      this.logger.warn(`Order with ID ${id} cannot be cancelled`);
      throw new BadRequestException('Order cannot be cancelled.');
    }

    if (order.status.includes('Cancelled')) {
      this.logger.warn(`Order with ID ${id} is already cancelled`);
      throw new BadRequestException('Order is already cancelled.');
    }

    const removeOrder = this.orderRepo.remove(order);
    const restockProduct = this.productRepo
      .findOneBy({ id: order.cart.product.id })
      .then((product) => {
        if (product) {
          return this.productRepo.update(product.id, {
            quantity: product.quantity + order.cart.quantity,
          });
        }
      });

    await Promise.all([removeOrder, restockProduct]);
    return { message: 'Order removed successfully' };
  }
}
