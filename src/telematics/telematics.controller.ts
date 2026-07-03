import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { TelematicsService } from './telematics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('telematics')
export class TelematicsController {
  constructor(private readonly telematicsService: TelematicsService) {}

  // 1. THE WEBHOOK (Unprotected by JWT, but you can add an API Key Guard later)
  @Post('webhook')
  handleIncomingTelemetry(@Body() payload: any) {
    // The GPS provider sends a POST request here every 10 seconds per machine
    return this.telematicsService.processIncomingData(payload);
  }

  // 2. THE FLEET MAP ENDPOINT (Protected)
  // Our Flutter app calls this to draw the machines on the map
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.COMPANY_OWNER, Role.FLEET_MANAGER, Role.SITE_SUPERVISOR)
  @Get('live-locations')
  getLiveLocations(@Request() req) {
    return this.telematicsService.getLatestFleetLocations(req.user.companyId);
  }
}