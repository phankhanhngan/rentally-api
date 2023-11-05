import { Test, TestingModule } from '@nestjs/testing';
import { FindingService } from './finding.service';

describe('FindingService', () => {
  let service: FindingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FindingService],
    }).compile();

    service = module.get<FindingService>(FindingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
