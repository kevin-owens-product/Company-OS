import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

// Entities
import { Codebase } from './entities/codebase.entity';
import { Repository } from './entities/repository.entity';
import { Analysis } from './entities/analysis.entity';
import { Finding } from './entities/finding.entity';
import { Playbook } from './entities/playbook.entity';
import { Transformation } from './entities/transformation.entity';

// Services
import { CodebaseService } from './services/codebase.service';
import { RepositoryService } from './services/repository.service';
import { AnalysisService } from './services/analysis.service';
import { FindingService } from './services/finding.service';
import { PlaybookService } from './services/playbook.service';
import { TransformationService } from './services/transformation.service';
import { IngestionService } from './services/ingestion.service';
import { GitService } from './services/git.service';
import { AiAnalysisService } from './services/ai-analysis.service';
import { AnalysisOrchestratorService } from './services/analysis-orchestrator.service';

// Controllers
import { CodebaseController } from './controllers/codebase.controller';
import { RepositoryController } from './controllers/repository.controller';
import { AnalysisController } from './controllers/analysis.controller';
import { PlaybookController } from './controllers/playbook.controller';
import { TransformationController } from './controllers/transformation.controller';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    TypeOrmModule.forFeature([
      Codebase,
      Repository,
      Analysis,
      Finding,
      Playbook,
      Transformation,
    ]),
  ],
  providers: [
    CodebaseService,
    RepositoryService,
    AnalysisService,
    FindingService,
    PlaybookService,
    TransformationService,
    IngestionService,
    GitService,
    AiAnalysisService,
    AnalysisOrchestratorService,
  ],
  controllers: [
    CodebaseController,
    RepositoryController,
    AnalysisController,
    PlaybookController,
    TransformationController,
  ],
  exports: [
    CodebaseService,
    RepositoryService,
    AnalysisService,
    FindingService,
    PlaybookService,
    TransformationService,
    IngestionService,
    GitService,
    AiAnalysisService,
    AnalysisOrchestratorService,
  ],
})
export class CodeForgeModule {}
