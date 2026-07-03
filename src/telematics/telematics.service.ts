import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TelematicsService {
  private readonly logger = new Logger(TelematicsService.name);

  constructor(private prisma: PrismaService) {}

  async processIncomingData(payload: any) {
    const { imei, latitude, longitude, speed, engineStatus, fuelLevelPercent, timestamp } = payload;

    // 1. Find the equipment associated with this GPS Tracker IMEI
    const equipment = await this.prisma.equipment.findUnique({
      where: { deviceImei: imei },
    });

    if (!equipment) {
      this.logger.warn(`Received telemetry for unknown IMEI: ${imei}`);
      throw new NotFoundException('Unregistered device IMEI');
    }

    // 2. Insert the high-frequency record
    const telemetryRecord = await this.prisma.gpsTelematics.create({
      data: {
        equipmentId: equipment.id,
        latitude: latitude,
        longitude: longitude,
        speed: speed ?? 0,
        engineStatus: engineStatus ?? false,
        fuelLevelPercent: fuelLevelPercent ?? null,
        receivedAt: timestamp ? new Date(timestamp) : new Date(),
      },
    });

    this.logger.log(`Telemetry saved for Equipment ID: ${equipment.id}`);
    return { success: true, recordId: telemetryRecord.id.toString() };
  }

  // A helper function for the Frontend to pull the latest location of all fleet assets
  async getLatestFleetLocations(companyId: string) {
    // In a production app, we would use a Redis cache here. 
    // For MVP, we query the latest record for each machine.
    return this.prisma.equipment.findMany({
      where: { companyId },
      include: {
        // We just want the most recent GPS ping
        telematics: {
          orderBy: { receivedAt: 'desc' },
          take: 1, 
        }
      }
    });
  }
}