import { Order } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    nullable: false,
    enum: ['card', 'bank_transfer', 'apple_pay', 'ussd', 'qr'],
  })
  method: 'card' | 'bank_transfer' | 'apple_pay' | 'ussd' | 'qr';

  @Column({ type: 'decimal', nullable: false })
  amount: number;

  @Column({
    nullable: false,
    enum: ['Initialized', 'Pending', 'Completed', 'Failed'],
  })
  status: 'Initialized' | 'Pending' | 'Completed' | 'Failed';

  @ManyToOne(() => User, { nullable: false, eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Order, { nullable: false, eager: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  create_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  update_at: Date;
}
