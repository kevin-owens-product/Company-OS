import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { TransformationService } from '../services/transformation.service';
import { CreateTransformationDto, ApprovalActionDto } from '../dto/create-transformation.dto';

@Controller('api/v1/transformations')
@UseGuards(JwtAuthGuard)
export class TransformationController {
  constructor(private readonly transformationService: TransformationService) {}

  @Post()
  async create(@Body() createTransformationDto: CreateTransformationDto, @Request() req) {
    return this.transformationService.create(createTransformationDto, req.user.id);
  }

  @Get()
  async findAll(@Query('codebaseId') codebaseId: string) {
    return this.transformationService.findAllByCodebase(codebaseId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transformationService.findOne(id);
  }

  @Get(':id/diff')
  async getDiff(@Param('id') id: string) {
    const transformation = await this.transformationService.findOne(id);
    // TODO: Implement actual diff retrieval
    return {
      transformationId: id,
      status: transformation.status,
      changes: [],
      summary: transformation.plan,
    };
  }

  // Workflow actions
  @Post(':id/submit')
  async submitForApproval(@Param('id') id: string) {
    return this.transformationService.submitForApproval(id);
  }

  @Post(':id/approve')
  async approve(
    @Param('id') id: string,
    @Body() approvalDto: ApprovalActionDto,
    @Request() req,
  ) {
    return this.transformationService.approve(id, req.user.id, approvalDto.comment);
  }

  @Post(':id/reject')
  async reject(
    @Param('id') id: string,
    @Body() approvalDto: ApprovalActionDto,
    @Request() req,
  ) {
    if (!approvalDto.comment) {
      throw new Error('Comment is required when rejecting a transformation');
    }
    return this.transformationService.reject(id, req.user.id, approvalDto.comment);
  }

  @Post(':id/execute')
  async execute(@Param('id') id: string) {
    await this.transformationService.queue(id);
    return this.transformationService.start(id);
  }

  @Post(':id/pause')
  async pause(@Param('id') id: string) {
    return this.transformationService.pause(id);
  }

  @Post(':id/resume')
  async resume(@Param('id') id: string) {
    return this.transformationService.resume(id);
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.transformationService.cancel(id);
  }

  @Post(':id/rollback')
  async rollback(@Param('id') id: string) {
    return this.transformationService.rollback(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.transformationService.remove(id);
    return { success: true };
  }
}
