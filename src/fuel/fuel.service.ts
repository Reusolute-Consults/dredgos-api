import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FuelService {
  constructor(private prisma: PrismaService) {}

  async logFuel(companyId: string, data: any) {
    // 1. Security Check: Verify the equipment actually belongs to this company
    const equipment = await this.prisma.equipment.findFirst({
      where: { id: data.equipmentId, companyId },
    });

    if (!equipment) {
      throw new NotFoundException('Equipment not found or access denied.');
    }

    // 2. Insert the fuel log
    return this.prisma.fuelLog.create({
      data: {
        companyId,
        equipmentId: data.equipmentId,
        logType: data.logType, // REFUEL, DISPENSE, THEFT_ALERT
        quantityLiters: data.quantityLiters,
        costPerLiter: data.costPerLiter ?? null,
      },
    });
  }

  async getCompanyFuelLogs(companyId: string) {
    // Fetch all fuel transactions, strictly isolated to the user's company
    return this.prisma.fuelLog.findMany({
      where: { companyId },
      include: { 
        equipment: { 
          select: { name: true, category: true } 
        } 
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}