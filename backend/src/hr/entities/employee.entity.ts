import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Department } from './department.entity';
import { Position } from './position.entity';
import { Leave } from './leave.entity';
import { Payroll } from './payroll.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  employeeId: string;

  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ type: 'date' })
  hireDate: Date;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ type: 'jsonb', default: {} })
  documents: Record<string, string>;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Department, (department: Department) => department.employees)
  department: Department;

  @ManyToOne(() => Position, (position: Position) => position.employees)
  position: Position;

  @OneToMany(() => Leave, (leave: Leave) => leave.employee)
  leaves: Leave[];

  @OneToMany(() => Payroll, (payroll: Payroll) => payroll.employee)
  payrolls: Payroll[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 