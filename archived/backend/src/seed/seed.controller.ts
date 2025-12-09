import { Controller, Post, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  async seed() {
    return this.seedService.seed();
  }

  @Get()
  async seedGet() {
    // Also allow GET for easy browser testing
    return this.seedService.seed();
  }
}
