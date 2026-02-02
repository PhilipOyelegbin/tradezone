import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

interface CartItem {
  product_id: string;
  quantity: number;
}

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 200 })
  shipping_address: string;

  @Column('jsonb')
  payment_info: { provider: string; amount: number };

  @Column('simple-enum', {
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  })
  status: ['Pending' | 'Shipped' | 'Delivered' | 'Cancelled'];

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'jsonb', nullable: false, default: [] })
  carts: CartItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
