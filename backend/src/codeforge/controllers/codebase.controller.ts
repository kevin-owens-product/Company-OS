import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CodebaseService } from '../services/codebase.service';
import { IngestionService } from '../services/ingestion.service';
import { AnalysisService } from '../services/analysis.service';
import { CreateCodebaseDto, UpdateCodebaseDto } from '../dto/create-codebase.dto';
import { ConnectGitHubDto, ConnectGitLabDto } from '../dto/create-repository.dto';
import { TriggerAnalysisDto } from '../dto/create-analysis.dto';

interface AuthenticatedRequest extends ExpressRequest {
  user: { id: string; tenantId: string };
}

@Controller('api/v1/codebases')
@UseGuards(JwtAuthGuard)
export class CodebaseController {
  constructor(
    private readonly codebaseService: CodebaseService,
    private readonly ingestionService: IngestionService,
    private readonly analysisService: AnalysisService,
  ) {}

  @Post()
  async create(@Body() createCodebaseDto: CreateCodebaseDto, @Request() req: AuthenticatedRequest) {
    return this.codebaseService.create(createCodebaseDto, req.user.tenantId);
  }

  @Get()
  async findAll(@Request() req: AuthenticatedRequest) {
    return this.codebaseService.findAll(req.user.tenantId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.codebaseService.findOne(id, req.user.tenantId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCodebaseDto: UpdateCodebaseDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.codebaseService.update(id, updateCodebaseDto, req.user.tenantId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    await this.codebaseService.remove(id, req.user.tenantId);
    return { success: true };
  }

  @Get(':id/statistics')
  async getStatistics(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.codebaseService.getStatistics(id, req.user.tenantId);
  }

  // Ingestion endpoints
  @Post(':id/ingest/github')
  async ingestFromGitHub(
    @Param('id') id: string,
    @Body() config: ConnectGitHubDto,
  ) {
    return this.ingestionService.ingestFromGitHub(id, config);
  }

  @Post(':id/ingest/gitlab')
  async ingestFromGitLab(
    @Param('id') id: string,
    @Body() config: ConnectGitLabDto,
  ) {
    return this.ingestionService.ingestFromGitLab(id, config);
  }

  // Analysis endpoints
  @Post(':id/analyze')
  async triggerAnalysis(
    @Param('id') id: string,
    @Body() triggerDto: TriggerAnalysisDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.analysisService.create({
      type: triggerDto.type,
      codebaseId: id,
      config: {
        depth: triggerDto.depth,
        targetRepositories: triggerDto.targetRepositories,
        playbooks: triggerDto.playbooks,
      },
      triggeredBy: req.user.id,
    });
  }

  @Get(':id/analysis')
  async getAnalyses(@Param('id') id: string) {
    return this.analysisService.findAllByCodebase(id);
  }

  @Get(':id/analysis/latest')
  async getLatestAnalysis(@Param('id') id: string) {
    return this.analysisService.getLatestByCodebase(id);
  }
}
