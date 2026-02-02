import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { BaseLogger } from '../_config';

@Injectable()
export class CategoriesService extends BaseLogger {
  constructor(
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {
    super(CategoriesService.name);
  }

  async create(dto: CreateCategoryDto) {
    const existingCategory = await this.categoryRepo.findOneBy({
      name: dto.name,
    });
    if (existingCategory) {
      this.logger.warn('Category name already exists.');
      throw new BadRequestException('Category with this name already exists');
    }

    const newCategory = this.categoryRepo.create({
      ...dto,
      name: dto.name.toUpperCase(),
    });
    const response = await this.categoryRepo.save(newCategory);
    return { message: 'New category added', data: response };
  }

  async findAll() {
    const response = await this.categoryRepo.find();
    return {
      message: 'Categories retrieved',
      data: response,
      count: response.length,
    };
  }

  async findOne(id: string) {
    const existingCategory = await this.categoryRepo.findOne({ where: { id } });
    if (!existingCategory) {
      this.logger.warn(`Category with ID ${id} not found.`);
      throw new NotFoundException('Category not found');
    }

    return { message: 'Category retrieved', data: existingCategory };
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const existingCategory = await this.categoryRepo.findOne({ where: { id } });
    if (!existingCategory) {
      this.logger.warn(`Category with ID ${id} not found.`);
      throw new NotFoundException('Category not found');
    }

    const updatedCategory = Object.assign(existingCategory, {
      ...dto,
      name: dto?.name?.toUpperCase(),
    });
    const response = await this.categoryRepo.save(updatedCategory);
    return { message: 'Category updated', data: response };
  }

  async remove(id: string) {
    const existingCategory = await this.categoryRepo.findOne({ where: { id } });
    if (!existingCategory) {
      this.logger.warn(`Category with ID ${id} not found.`);
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepo.remove(existingCategory);
    return { message: 'Category removed' };
  }
}
