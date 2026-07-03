import { Test, TestingModule } from '@nestjs/testing';
import { TelematicsService } from './telematics.service';

describe('TelematicsService', () => {
  let service: TelematicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TelematicsService],
    }).compile();

    service = module.get<TelematicsService>(TelematicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
