import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, PrismaService],
  exports: [SubscriptionsService], // To be used by Equipment Module
})
export class SubscriptionsModule {}
