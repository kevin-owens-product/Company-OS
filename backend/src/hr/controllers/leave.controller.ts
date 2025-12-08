import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LeaveService } from '../services/leave.service';
import { CreateLeaveDto } from '../dto/create-leave.dto';
import { UpdateLeaveDto } from '../dto/update-leave.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Leave, LeaveType, LeaveStatus } from '../entities/leave.entity';

@ApiTags('hr/leaves')
@Controller('hr/leaves')
export class LeaveController {
  constructor(private readonly leaveService: LeaveService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new leave request' })
  @ApiResponse({ status: 201, description: 'Leave request created successfully', type: Leave })
  create(@Body() createLeaveDto: CreateLeaveDto): Promise<Leave> {
    return this.leaveService.create(createLeaveDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leave requests' })
  @ApiResponse({ status: 200, description: 'Return all leave requests', type: [Leave] })
  findAll(): Promise<Leave[]> {
    return this.leaveService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get leave request by id' })
  @ApiResponse({ status: 200, description: 'Return the leave request', type: Leave })
  findOne(@Param('id') id: string): Promise<Leave> {
    return this.leaveService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update leave request' })
  @ApiResponse({ status: 200, description: 'Leave request updated successfully', type: Leave })
  update(
    @Param('id') id: string,
    @Body() updateLeaveDto: UpdateLeaveDto,
  ): Promise<Leave> {
    return this.leaveService.update(id, updateLeaveDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete leave request' })
  @ApiResponse({ status: 200, description: 'Leave request deleted successfully' })
  remove(@Param('id') id: string): Promise<void> {
    return this.leaveService.remove(id);
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get leave requests by employee' })
  @ApiResponse({ status: 200, description: 'Return leave requests for employee', type: [Leave] })
  findByEmployee(@Param('employeeId') employeeId: string): Promise<Leave[]> {
    return this.leaveService.findByEmployee(employeeId);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get leave requests by status' })
  @ApiResponse({ status: 200, description: 'Return leave requests by status', type: [Leave] })
  findByStatus(@Param('status') status: LeaveStatus): Promise<Leave[]> {
    return this.leaveService.findByStatus(status);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Get leave requests by type' })
  @ApiResponse({ status: 200, description: 'Return leave requests by type', type: [Leave] })
  findByType(@Param('type') type: LeaveType): Promise<Leave[]> {
    return this.leaveService.findByType(type);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve leave request' })
  @ApiResponse({ status: 200, description: 'Leave request approved successfully', type: Leave })
  approveLeave(
    @Param('id') id: string,
    @Query('approverId') approverId: string,
    @Query('comments') comments?: string,
  ): Promise<Leave> {
    return this.leaveService.approveLeave(id, approverId, comments);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject leave request' })
  @ApiResponse({ status: 200, description: 'Leave request rejected successfully', type: Leave })
  rejectLeave(
    @Param('id') id: string,
    @Query('approverId') approverId: string,
    @Query('comments') comments: string,
  ): Promise<Leave> {
    return this.leaveService.rejectLeave(id, approverId, comments);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel leave request' })
  @ApiResponse({ status: 200, description: 'Leave request cancelled successfully', type: Leave })
  cancelLeave(
    @Param('id') id: string,
    @Query('employeeId') employeeId: string,
  ): Promise<Leave> {
    return this.leaveService.cancelLeave(id, employeeId);
  }

  @Patch(':id/attachments')
  @ApiOperation({ summary: 'Update leave request attachments' })
  @ApiResponse({ status: 200, description: 'Leave request attachments updated successfully', type: Leave })
  updateAttachments(
    @Param('id') id: string,
    @Body() attachments: Record<string, string>,
  ): Promise<Leave> {
    return this.leaveService.updateLeaveAttachments(id, attachments);
  }
} 