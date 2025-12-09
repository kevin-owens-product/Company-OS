import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { CreateCustomerDto } from '../dto/create-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async findAll(tenantId: string): Promise<Customer[]> {
    return await this.customerRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['contacts', 'opportunities'],
    });
  }

  async findOne(id: string, tenantId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, tenant: { id: tenantId } },
      relations: ['contacts', 'opportunities', 'activities'],
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return customer;
  }

  async update(id: string, updateCustomerDto: Partial<CreateCustomerDto>): Promise<Customer> {
    const customer = await this.customerRepository.preload({
      id,
      ...updateCustomerDto,
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    return await this.customerRepository.save(customer);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const customer = await this.findOne(id, tenantId);
    await this.customerRepository.remove(customer);
  }

  async findByEmail(email: string, tenantId: string): Promise<Customer | null> {
    return await this.customerRepository.findOne({
      where: { email, tenant: { id: tenantId } },
    });
  }

  async updateTags(id: string, tags: string[]): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    customer.tags = tags;
    return await this.customerRepository.save(customer);
  }

  async updateLifetimeValue(id: string, amount: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }

    customer.lifetimeValue += amount;
    return await this.customerRepository.save(customer);
  }
} 