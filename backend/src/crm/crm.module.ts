import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Contact } from './entities/contact.entity';
import { Opportunity } from './entities/opportunity.entity';
import { Activity } from './entities/activity.entity';
import { CustomerService } from './services/customer.service';
import { ContactService } from './services/contact.service';
import { OpportunityService } from './services/opportunity.service';
import { ActivityService } from './services/activity.service';
import { CustomerController } from './controllers/customer.controller';
import { ContactController } from './controllers/contact.controller';
import { OpportunityController } from './controllers/opportunity.controller';
import { ActivityController } from './controllers/activity.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Customer,
      Contact,
      Opportunity,
      Activity,
    ]),
  ],
  providers: [
    CustomerService,
    ContactService,
    OpportunityService,
    ActivityService,
  ],
  controllers: [
    CustomerController,
    ContactController,
    OpportunityController,
    ActivityController,
  ],
  exports: [
    CustomerService,
    ContactService,
    OpportunityService,
    ActivityService,
  ],
})
export class CrmModule {} 