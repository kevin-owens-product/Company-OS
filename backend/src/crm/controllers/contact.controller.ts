import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ContactService } from '../services/contact.service';
import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from '../dto/create-contact.dto';

@ApiTags('crm/contacts')
@Controller('crm/contacts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  @ApiResponse({ status: 201, description: 'Contact created successfully', type: Contact })
  create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  @ApiResponse({ status: 200, description: 'Return all contacts', type: [Contact] })
  findAll(@Query('tenantId') tenantId: string): Promise<Contact[]> {
    return this.contactService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contact by id' })
  @ApiResponse({ status: 200, description: 'Return the contact', type: Contact })
  findOne(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<Contact> {
    return this.contactService.findOne(id, tenantId);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get all contacts for a customer' })
  @ApiResponse({ status: 200, description: 'Return contacts for the customer', type: [Contact] })
  findByCustomer(
    @Param('customerId') customerId: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Contact[]> {
    return this.contactService.findByCustomer(customerId, tenantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact' })
  @ApiResponse({ status: 200, description: 'Contact updated successfully', type: Contact })
  update(
    @Param('id') id: string,
    @Body() updateContactDto: Partial<CreateContactDto>,
  ): Promise<Contact> {
    return this.contactService.update(id, updateContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contact' })
  @ApiResponse({ status: 200, description: 'Contact deleted successfully' })
  remove(@Param('id') id: string, @Query('tenantId') tenantId: string): Promise<void> {
    return this.contactService.remove(id, tenantId);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Find a contact by email' })
  @ApiResponse({ status: 200, description: 'Return the contact', type: Contact })
  findByEmail(
    @Param('email') email: string,
    @Query('tenantId') tenantId: string,
  ): Promise<Contact | null> {
    return this.contactService.findByEmail(email, tenantId);
  }
}
