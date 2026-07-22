import { Module } from '@nestjs/common';
import { ProductionService } from './production.service';
import { ProductionController } from './production.controller';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Module({
  providers: [ProductionService, PrismaService],
  controllers: [ProductionController]
})
export class ProductionModule {}
