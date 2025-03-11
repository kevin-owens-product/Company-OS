import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { Department } from './entities/department.entity';
import { Position } from './entities/position.entity';
import { Leave } from './entities/leave.entity';
import { Payroll } from './entities/payroll.entity';
import { EmployeeService } from './services/employee.service';
import { DepartmentService } from './services/department.service';
import { PositionService } from './services/position.service';
import { LeaveService } from './services/leave.service';
import { PayrollService } from './services/payroll.service';
import { EmployeeController } from './controllers/employee.controller';
import { DepartmentController } from './controllers/department.controller';
import { PositionController } from './controllers/position.controller';
import { LeaveController } from './controllers/leave.controller';
import { PayrollController } from './controllers/payroll.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      Department,
      Position,
      Leave,
      Payroll,
    ]),
  ],
  providers: [
    EmployeeService,
    DepartmentService,
    PositionService,
    LeaveService,
    PayrollService,
  ],
  controllers: [
    EmployeeController,
    DepartmentController,
    PositionController,
    LeaveController,
    PayrollController,
  ],
  exports: [
    EmployeeService,
    DepartmentService,
    PositionService,
    LeaveService,
    PayrollService,
  ],
})
export class HrModule {} 