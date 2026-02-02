import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { BaseLogger } from '../_config';

@Injectable()
export class SeedService extends BaseLogger {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {
    super(SeedService.name);
  }

  async seedAdministrator() {
    const userData = {
      first_name: 'Admin',
      last_name: 'User',
      email: process.env.SEED_USER_EMAIL,
      password: `${process.env.SEED_USER_PASSWORD}`,
      is_admin: true,
      is_verified: true,
      address: '123 Admin St, Admin City, Admin State, 12345',
      phone_number: '123-456-7890',
    };

    const existingUser = await this.userRepo.find({
      where: { email: userData.email },
    });
    const hash = await argon.hash(userData.password);
    userData.password = hash;

    if (!existingUser || existingUser.length === 0) {
      const seedAdmin = this.userRepo.create({
        ...userData,
      });
      await this.userRepo.save(seedAdmin);
      this.logger.log('Admin user seeded successfully!');
    } else {
      this.logger.log('Admin user already exist, skipping seed.');
    }
  }
}
