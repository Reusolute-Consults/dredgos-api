import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [SubscriptionsModule], // Add the Subscriptions module to the imports array
  controllers: [EquipmentController],
  providers: [EquipmentService, PrismaService],
})
export class EquipmentModule {}