import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductionService {
  constructor(private prisma: PrismaService) {}

  // 1. Log direct dredging output
  async logProduction(companyId: string, data: any) {
    const equipment = await this.prisma.equipment.findFirst({
      where: { id: data.equipmentId, companyId },
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found or access denied.');
    }

    return this.prisma.productionLog.create({
      data: {
        equipmentId: data.equipmentId,
        volumeM3: data.volumeM3,
        avgPumpPressureBar: data.avgPumpPressureBar,
        operatingHours: data.operatingHours,
      },
    });
  }

  // 2. Log material movement (Trucks/Barges)
  async logMaterialTrip(companyId: string, data: any) {
    const equipment = await this.prisma.equipment.findFirst({
      where: { id: data.equipmentId, companyId },
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found or access denied.');
    }

    return this.prisma.materialTrip.create({
      data: {
        equipmentId: data.equipmentId,
        ticketNumber: data.ticketNumber,
        estimatedVolumeM3: data.estimatedVolumeM3,
      },
    });
  }

  // 3. Fetch company-wide production history
  async getCompanyProductionLogs(companyId: string) {
    return this.prisma.productionLog.findMany({
      where: { 
        equipment: { companyId } // Filter through the relation
      },
      include: { 
        equipment: { 
          select: { name: true, category: true } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}