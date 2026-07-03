import { Test, TestingModule } from '@nestjs/testing';
import { TelematicsController } from './telematics.controller';

describe('TelematicsController', () => {
  let controller: TelematicsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelematicsController],
    }).compile();

    controller = module.get<TelematicsController>(TelematicsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
