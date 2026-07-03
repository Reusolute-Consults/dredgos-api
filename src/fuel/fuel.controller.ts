import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  // Supervisors in the field must be able to log fuel usage and alerts
  @Roles(Role.COMPANY_OWNER, Role.FLEET_MANAGER, Role.SITE_SUPERVISOR)
  @Post()
  logFuelTransaction(@Request() req, @Body() body: any) {
    return this.fuelService.logFuel(req.user.companyId, body);
  }

  // Owners and Fleet Managers can view the entire company fuel history
  @Roles(Role.COMPANY_OWNER, Role.FLEET_MANAGER)
  @Get()
  getFuelHistory(@Request() req) {
    return this.fuelService.getCompanyFuelLogs(req.user.companyId);
  }
}