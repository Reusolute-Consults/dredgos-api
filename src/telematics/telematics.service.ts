import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelematicsService {
  private readonly logger = new Logger(TelematicsService.name);

  constructor(private prisma: PrismaService) {}

  // 1. The Webhook + Delta Engine
  async processIncomingData(data: any) {
    const equipment = await this.prisma.equipment.findFirst({
      where: { deviceImei: data.imei },
    });

    if (!equipment) {
      this.logger.warn(`Webhook rejected: Unknown IMEI ${data.imei}`);
      return { success: false, message: 'Equipment not found' };
    }

    // The Delta Engine for Automated Fuel Tracking
    if (data.fuelLevelPercent !== undefined) {
      // Using your corrected gpsTelematics and receivedAt properties
      const lastPing = await this.prisma.gpsTelematics.findFirst({
        where: { equipmentId: equipment.id },
        orderBy: { receivedAt: 'desc' }, 
      });

      if (lastPing && lastPing.fuelLevelPercent !== null) {
        const oldFuel = Number(lastPing.fuelLevelPercent);
        const newFuel = Number(data.fuelLevelPercent);
        const fuelDiff = newFuel - oldFuel;

        const tankCapacity = Number(equipment.fuelCapacity) || 0;
        const estimatedLiters = tankCapacity > 0 
          ? (Math.abs(fuelDiff) / 100) * tankCapacity 
          : 0;

        if (fuelDiff >= 5.0) {
          this.logger.log(`[DELTA ENGINE] Refill detected: +${fuelDiff}% (${estimatedLiters} Liters)`);
          
          await this.prisma.fuelLog.create({
            data: {
              companyId: equipment.companyId,
              equipmentId: equipment.id,
              logType: 'REFUEL',
              quantityLiters: estimatedLiters,
              costPerLiter: null, 
            }
          });
        } 
        else if (fuelDiff <= -3.0 && data.engineStatus === false) {
          this.logger.warn(`[DELTA ENGINE] THEFT ALERT! Dropped: ${fuelDiff}% (${estimatedLiters} Liters)`);
          
          await this.prisma.fuelLog.create({
            data: {
              companyId: equipment.companyId,
              equipmentId: equipment.id,
              logType: 'THEFT_ALERT',
              quantityLiters: estimatedLiters,
              costPerLiter: null,
            }
          });
        }
      }
    }

    // Save the new GPS location and fuel state
    await this.prisma.gpsTelematics.create({
      data: {
        equipmentId: equipment.id,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed ?? 0,
        engineStatus: data.engineStatus ?? false,
        fuelLevelPercent: data.fuelLevelPercent ?? null,
      },
    });

    return { success: true };
  }

  // 2. The Map Data Fetcher (Restored for the Flutter App)
  async getLatestFleetLocations(companyId: string) {
    return this.prisma.equipment.findMany({
      where: { companyId },
      select: {
        id: true,
        name: true,
        category: true,
        status: true,
        // Using your corrected gpsTelematics and receivedAt properties
        telematics: { 
          orderBy: { receivedAt: 'desc' },
          take: 1,
        },
      },
    });
  }
}