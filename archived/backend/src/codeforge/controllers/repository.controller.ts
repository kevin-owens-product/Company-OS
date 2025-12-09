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
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RepositoryService } from '../services/repository.service';
import { IngestionService } from '../services/ingestion.service';
import { FindingService } from '../services/finding.service';
import { CreateRepositoryDto, UpdateRepositoryDto } from '../dto/create-repository.dto';

@Controller('api/v1/repositories')
@UseGuards(JwtAuthGuard)
export class RepositoryController {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly ingestionService: IngestionService,
    private readonly findingService: FindingService,
  ) {}

  @Post()
  async create(@Body() createRepositoryDto: CreateRepositoryDto) {
    return this.repositoryService.create(createRepositoryDto);
  }

  @Get()
  async findAll(@Query('codebaseId') codebaseId: string) {
    return this.repositoryService.findAllByCodebase(codebaseId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.repositoryService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRepositoryDto: UpdateRepositoryDto,
  ) {
    return this.repositoryService.update(id, updateRepositoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.repositoryService.remove(id);
    return { success: true };
  }

  @Post(':id/refresh')
  async refresh(@Param('id') id: string) {
    return this.ingestionService.refreshRepository(id);
  }

  @Get(':id/findings')
  async getFindings(@Param('id') id: string) {
    return this.findingService.findAllByRepository(id);
  }

  @Get(':id/findings/stats/severity')
  async getFindingsBySeverity(@Param('id') id: string) {
    return this.findingService.getStatsBySeverity(id);
  }

  @Get(':id/findings/stats/category')
  async getFindingsByCategory(@Param('id') id: string) {
    return this.findingService.getStatsByCategory(id);
  }
}
