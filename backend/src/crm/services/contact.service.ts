import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from '../dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<Contact> {
    const contact = this.contactRepository.create({
      ...createContactDto,
      customer: { id: createContactDto.customerId },
      tenant: { id: createContactDto.tenantId },
    });
    return await this.contactRepository.save(contact);
  }

  async findAll(tenantId: string): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['customer'],
    });
  }

  async findOne(id: string, tenantId: string): Promise<Contact> {
    const contact = await this.contactRepository.findOne({
      where: { id, tenant: { id: tenantId } },
      relations: ['customer'],
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return contact;
  }

  async findByCustomer(customerId: string, tenantId: string): Promise<Contact[]> {
    return await this.contactRepository.find({
      where: { customer: { id: customerId }, tenant: { id: tenantId } },
    });
  }

  async update(id: string, updateContactDto: Partial<CreateContactDto>): Promise<Contact> {
    const contact = await this.contactRepository.preload({
      id,
      ...updateContactDto,
    });

    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }

    return await this.contactRepository.save(contact);
  }

  async remove(id: string, tenantId: string): Promise<void> {
    const contact = await this.findOne(id, tenantId);
    await this.contactRepository.remove(contact);
  }

  async findByEmail(email: string, tenantId: string): Promise<Contact | null> {
    return await this.contactRepository.findOne({
      where: { email, tenant: { id: tenantId } },
    });
  }
}
