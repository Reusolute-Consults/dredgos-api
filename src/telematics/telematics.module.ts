import { Module } from '@nestjs/common';
import { TelematicsService } from './telematics.service';
import { TelematicsController } from './telematics.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [TelematicsController],
  providers: [TelematicsService, PrismaService],
})
export class TelematicsModule {}