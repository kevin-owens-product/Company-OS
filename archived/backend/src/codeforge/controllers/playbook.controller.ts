import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PlaybookService } from '../services/playbook.service';
import { CreatePlaybookDto, UpdatePlaybookDto } from '../dto/create-playbook.dto';
import { PlaybookCategory } from '../entities/playbook.entity';

@Controller('api/v1/playbooks')
@UseGuards(JwtAuthGuard)
export class PlaybookController {
  constructor(private readonly playbookService: PlaybookService) {}

  @Post()
  async create(@Body() createPlaybookDto: CreatePlaybookDto, @Request() req) {
    return this.playbookService.create(createPlaybookDto, req.user.tenantId);
  }

  @Get()
  async findAll(@Request() req, @Query('category') category?: PlaybookCategory) {
    if (category) {
      return this.playbookService.findByCategory(category, req.user.tenantId);
    }
    return this.playbookService.findAll(req.user.tenantId);
  }

  @Get('categories')
  async getCategories() {
    return [
      { id: 'consolidation', name: 'Technology Stack Consolidation', code: 'PB-100' },
      { id: 'security', name: 'Security Hardening', code: 'PB-200' },
      { id: 'cost_optimization', name: 'Cost Optimization', code: 'PB-300' },
      { id: 'developer_experience', name: 'Developer Experience', code: 'PB-400' },
      { id: 'compliance', name: 'Compliance and Governance', code: 'PB-500' },
    ];
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.playbookService.findOne(id);
  }

  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.playbookService.findByCode(code);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlaybookDto: UpdatePlaybookDto,
  ) {
    return this.playbookService.update(id, updatePlaybookDto);
  }

  @Post(':id/activate')
  async activate(@Param('id') id: string) {
    return this.playbookService.activate(id);
  }

  @Post(':id/deprecate')
  async deprecate(@Param('id') id: string) {
    return this.playbookService.deprecate(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.playbookService.remove(id);
    return { success: true };
  }

  @Post('seed')
  async seedBuiltIn() {
    await this.playbookService.seedBuiltInPlaybooks();
    return { success: true, message: 'Built-in playbooks seeded successfully' };
  }
}
