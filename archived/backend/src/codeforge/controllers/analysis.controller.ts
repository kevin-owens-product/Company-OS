import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AnalysisService } from '../services/analysis.service';
import { FindingService } from '../services/finding.service';

@Controller('api/v1/analyses')
@UseGuards(JwtAuthGuard)
export class AnalysisController {
  constructor(
    private readonly analysisService: AnalysisService,
    private readonly findingService: FindingService,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.analysisService.findOne(id);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.analysisService.cancel(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.analysisService.remove(id);
    return { success: true };
  }

  @Get(':id/findings')
  async getFindings(@Param('id') id: string) {
    return this.findingService.findAllByAnalysis(id);
  }
}
