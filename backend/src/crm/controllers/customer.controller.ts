import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CustomerService } from '../services/customer.service';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';

@ApiTags('customers')
@Controller('customers')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully', type: Customer })
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'Return all customers', type: [Customer] })
  findAll(@Query('tenantId') tenantId: string): Promise<Customer[]> {
    return this.customerService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by id' })
  @ApiResponse({ status: 200, description: 'Return the customer', type: Customer })
  findOne(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<Customer> {
    return this.customerService.findOne(id, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully', type: Customer })
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: Partial<CreateCustomerDto>,
  ): Promise<Customer> {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  remove(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<void> {
    return this.customerService.remove(id, tenantId);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Find a customer by email' })
  @ApiResponse({ status: 200, description: 'Return the customer', type: Customer })
  findByEmail(
    @Param('email') email: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Customer | null> {
    return this.customerService.findByEmail(email, tenantId);
  }

  @Patch(':id/tags')
  @ApiOperation({ summary: 'Update customer tags' })
  @ApiResponse({ status: 200, description: 'Customer tags updated successfully', type: Customer })
  updateTags(
    @Param('id') id: string,
    @Body('tags') tags: string[],
  ): Promise<Customer> {
    return this.customerService.updateTags(id, tags);
  }

  @Patch(':id/lifetime-value')
  @ApiOperation({ summary: 'Update customer lifetime value' })
  @ApiResponse({ status: 200, description: 'Customer lifetime value updated successfully', type: Customer })
  updateLifetimeValue(
    @Param('id') id: string,
    @Body('amount') amount: number,
  ): Promise<Customer> {
    return this.customerService.updateLifetimeValue(id, amount);
  }
} 