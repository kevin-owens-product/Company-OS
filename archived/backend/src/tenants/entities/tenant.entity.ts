import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  domain: string;

  @Column({ type: 'jsonb', default: {} })
  settings: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  subscriptionId: string;

  @Column({ type: 'timestamp', nullable: true })
  subscriptionEndDate: Date;

  @OneToMany(() => User, (user: User) => user.tenant)
  users: User[];

  // These relations are defined in HR module but referenced here for TypeORM
  departments?: any[];
  positions?: any[];

  // CRM relations
  customers?: any[];
  opportunities?: any[];
  contacts?: any[];
  activities?: any[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 