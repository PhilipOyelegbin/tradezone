import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { Storage } from '../_helper';
import { BaseLogger } from '../_config';

@Injectable()
export class ProductsService extends BaseLogger {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly storage: Storage,
  ) {
    super(ProductsService.name);
  }

  async create(files: Array<Express.Multer.File>, dto: CreateProductDto) {
    const uploadPromises = files.map((file) =>
      this.storage.uploadProductImages(file.originalname, file.buffer),
    );
    await Promise.all(uploadPromises);

    const newProduct = this.productRepo.create({
      ...dto,
      images: [
        `${process.env.STORAGE_URL}/${files[0].originalname}`,
        files[1] ? `${process.env.STORAGE_URL}/${files[1].originalname}` : '',
      ],
      category: { id: dto.category_id },
      price: parseFloat(dto.price),
      quantity: parseInt(dto.quantity),
    });
    const response = await this.productRepo.save(newProduct);
    return { message: 'Product created successfully', data: response };
  }

  async findAll(
    page: number,
    pageSize: number,
    category?: string,
    price?: string,
  ) {
    const calSkip = (page - 1) * pageSize;
    const response = await this.productRepo.find({
      relations: ['category'],
      skip: calSkip,
      take: pageSize,
    });
    if (category || price) {
      const filtered = response.filter(
        (product) =>
          product.category.name === category?.toUpperCase() &&
          product.price <= parseFloat(price || '0'),
      );
      if (filtered.length === 0) {
        this.logger.warn(
          'No products found for the given category or price filter',
        );
        throw new NotFoundException('No products found for this category');
      }
      return {
        message: 'Filtered products retrieved successfully',
        data: filtered,
        count: filtered.length,
        currentPage: page,
        pageSize: pageSize,
        totalPages: Math.ceil(filtered.length / pageSize),
      };
    }
    return {
      message: 'Products retrieved successfully',
      data: response,
      count: response.length,
      currentPage: page,
      pageSize: pageSize,
      totalPages: Math.ceil(response.length / pageSize),
    };
  }

  async findOne(id: string) {
    const existingProduct = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!existingProduct) {
      this.logger.warn(`Product with ID ${id} not found`);
      throw new NotFoundException('Product not found');
    }

    return { message: 'Product retrieved successfully', data: existingProduct };
  }

  async updateImages(id: string, files: Array<Express.Multer.File>) {
    const existingProduct = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!existingProduct) {
      this.logger.warn(`Product with ID ${id} not found`);
      throw new NotFoundException('Product not found');
    }

    const uploadPromises = files.map((file) =>
      this.storage.uploadProductImages(file.originalname, file.buffer),
    );
    await Promise.all(uploadPromises);

    if (existingProduct.images[1]) {
      const removePromises = existingProduct.images.map((file) =>
        this.storage.deleteProductImages(file?.split('/').pop() || ''),
      );
      await Promise.all(removePromises);
    } else {
      await this.storage.deleteProductImages(
        existingProduct.images[0]?.split('/').pop() || '',
      );
    }

    await this.productRepo.update(id, {
      ...existingProduct,
      images: [
        `${process.env.STORAGE_URL}/${files[0].originalname}`,
        files[1] ? `${process.env.STORAGE_URL}/${files[1].originalname}` : '',
      ],
    });
    return { message: 'Product updated successfully' };
  }

  async updateDetails(id: string, dto: UpdateProductDto) {
    const existingProduct = await this.productRepo.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!existingProduct) {
      this.logger.warn(`Product with ID ${id} not found`);
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = Object.assign(existingProduct, {
      ...dto,
      category: { id: dto.category_id || existingProduct.category.id },
      price: dto.price ? parseFloat(dto.price) : existingProduct.price,
      quantity: dto.quantity
        ? parseInt(dto.quantity)
        : existingProduct.quantity,
    });
    const response = await this.productRepo.save(updatedProduct);
    return { message: 'Product updated successfully', data: response };
  }

  async remove(id: string) {
    const existingProduct = await this.productRepo.findOne({ where: { id } });
    if (!existingProduct) {
      this.logger.warn(`Product with ID ${id} not found`);
      throw new NotFoundException('Product not found');
    }

    if (existingProduct.images[1]) {
      const removePromises = existingProduct.images.map((file) =>
        this.storage.deleteProductImages(file?.split('/').pop() || ''),
      );
      await Promise.all(removePromises);
    } else {
      await this.storage.deleteProductImages(
        existingProduct.images[0]?.split('/').pop() || '',
      );
    }

    await this.productRepo.remove(existingProduct);
    return { message: 'Product removed successfully' };
  }
}
