import { Module } from '@nestjs/common';
import { FindingService } from './finding.service';
import { FindingController } from './finding.controller';

@Module({
  providers: [FindingService],
  controllers: [FindingController]
})
export class FindingModule {}
