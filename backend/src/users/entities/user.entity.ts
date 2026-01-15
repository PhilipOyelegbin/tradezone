import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, nullable: false })
  first_name: string;

  @Column({ length: 100, nullable: false })
  last_name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ length: 200, nullable: false })
  address: string;

  @Column({ length: 15, nullable: false })
  phone_number: string;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: false })
  is_verified: boolean;

  @Column({ length: 8, nullable: true })
  verification_token: string;

  @Column({ type: 'timestamp', nullable: true })
  verification_token_expires_at: Date;

  @Column({ length: 8, nullable: true })
  reset_token: string;

  @Column({ type: 'timestamp', nullable: true })
  reset_token_expires_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_ast: Date;
}
