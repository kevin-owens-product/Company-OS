import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Employee } from './employee.entity';
import { Department } from './department.entity';
import { Tenant } from '../../tenants/entities/tenant.entity';

@Entity('positions')
export class Position {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  baseSalary: number;

  @Column({ type: 'jsonb', default: {} })
  requirements: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  responsibilities: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  tenantId: string;

  @ManyToOne(() => Tenant)
  tenant: Tenant;

  @Column({ nullable: true })
  departmentId: string;

  @ManyToOne(() => Department)
  department: Department;

  @OneToMany(() => Employee, (employee: Employee) => employee.position)
  employees: Employee[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 