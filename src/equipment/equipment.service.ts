import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

@Injectable()
export class EquipmentService {
  constructor(
    private prisma: PrismaService,
    private subscriptionsService: SubscriptionsService, // Inject SaaS billing engine
  ) {}

  async createEquipment(companyId: string, data: any) {
    // 1. Enforce SaaS Billing Limit before creating the asset
    await this.subscriptionsService.checkEquipmentLimit(companyId);

    // 2. Create the asset securely bound to this company
    return this.prisma.equipment.create({
      data: {
        companyId,
        name: data.name,
        category: data.category,
        serialNumber: data.serialNumber,
        deviceImei: data.deviceImei,
        fuelCapacity: data.fuelCapacity,
        status: 'WORKING', // Default status for new assets
      },
    });
  }

  async findAllForCompany(companyId: string) {
    // Fetch all assets, strictly isolated to the user's company
    return this.prisma.equipment.findMany({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateEquipmentStatus(companyId: string, equipmentId: string, status: string) {
    // 1. Verify the asset actually belongs to this company
    const asset = await this.prisma.equipment.findFirst({
      where: { id: equipmentId, companyId },
    });

    if (!asset) {
      throw new NotFoundException('Equipment not found or access denied.');
    }

    // 2. Update the status
    return this.prisma.equipment.update({
      where: { id: equipmentId },
      data: { status },
    });
  }
}