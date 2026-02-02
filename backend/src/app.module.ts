import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from './categories/categories.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis, { Keyv } from '@keyv/redis';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CacheableMemory } from 'cacheable';
import { SeedModule } from './_seed/seed.module';
import { AppController } from './app.controller';
import { SeedService } from './_seed/seed.service';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'seconds',
          ttl: 1000 * 1, // 1 second
          limit: 2,
        },
        {
          name: 'hourly',
          ttl: 1000 * 60 * 60, // 1 hour
          limit: 25,
        },
        {
          name: 'daily',
          ttl: 1000 * 60 * 60 * 24, // 1 day
          limit: 50,
        },
      ],
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: `${process.env.DB_PASSWORD}`,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => {
        return {
          ttl: 300_000, // 5 minutes
          stores: [
            new KeyvRedis(process.env.REDIS_URL || '', {
              namespace: 'tz',
            }),
            new Keyv({
              store: new CacheableMemory({ ttl: 600_000, lruSize: 5000 }),
            }),
          ],
        };
      },
    }),
    UsersModule,
    ProductsModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    CategoriesModule,
    SeedModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [
    SeedService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
