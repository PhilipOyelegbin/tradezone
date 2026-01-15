import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CreateCartDto, UpdateCartDto } from './dto';
import { BaseLogger } from 'src/_config';

@Injectable()
export class CartService extends BaseLogger {
  constructor(
    @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
  ) {
    super(CartService.name);
  }

  async create(dto: CreateCartDto, userId: string) {
    const existingProductCart = await this.cartRepo.findOne({
      where: {
        user: { id: userId },
        product: { id: dto?.product_id },
      },
      relations: ['user', 'product'],
    });
    if (existingProductCart) {
      this.logger.warn(
        `Cart for user ID ${userId} and product ID ${dto.product_id} already exists`,
      );
      throw new BadRequestException('Cart for this product already exists');
    }

    const newCart = this.cartRepo.create({
      ...dto,
      user: { id: userId },
      product: { id: dto.product_id },
    });
    const response = await this.cartRepo.save(newCart);
    return { message: 'Cart created successfully', data: response };
  }

  async findAll(userId: string) {
    const response = await this.cartRepo.find({
      where: { user: { id: userId } },
      relations: ['user', 'product'],
    });
    return {
      message: 'Carts fetched successfully',
      data: response,
      count: response.length,
    };
  }

  async findOne(id: string) {
    const existingCart = await this.cartRepo.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
    if (!existingCart || existingCart?.id === null) {
      this.logger.warn(`Cart with ID ${id} not found`);
      throw new NotFoundException('Cart not found');
    }

    return { message: 'Cart fetched successfully', data: existingCart };
  }

  async update(id: string, userId: string, dto: UpdateCartDto) {
    const existingCart = await this.cartRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'product'],
    });
    if (!existingCart || existingCart?.id === null) {
      this.logger.warn(`Cart with ID ${id} not found`);
      throw new NotFoundException('Cart not found');
    }

    const updatedCart = Object.assign(existingCart, {
      ...dto,
      user: { id: userId || existingCart.user.id },
      product: { id: dto.product_id || existingCart.product.id },
    });
    const response = await this.cartRepo.save(updatedCart);
    return { message: 'Cart updated successfully', data: response };
  }

  async remove(id: string, userId: string) {
    const existingCart = await this.cartRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user', 'product'],
    });
    if (!existingCart || existingCart?.id === null) {
      this.logger.warn(`Cart with ID ${id} not found`);
      throw new NotFoundException('Cart not found');
    }

    await this.cartRepo.remove(existingCart);
    return { message: 'Cart deleted successfully' };
  }
}
