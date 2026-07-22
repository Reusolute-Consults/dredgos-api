import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ProductionService } from './production.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('production')
export class ProductionController {
  constructor(private readonly productionService: ProductionService) {}

  // POST: /production/dredge -> Logs actual pumping volume
  @Roles(Role.COMPANY_OWNER, Role.FLEET_MANAGER, Role.SITE_SUPERVISOR)
  @Post('dredge')
  logProduction(@Request() req, @Body() body: any) {
    return this.productionService.logProduction(req.user.companyId, body);
  }

  // POST: /production/trip -> Logs a truck/barge leaving the site
  @Roles(Role.COMPANY_OWNER, Role.FLEET_MANAGER, Role.SITE_SUPERVISOR)
  @Post('trip')
  logTrip(@Request() req, @Body() body: any) {
    return this.productionService.logMaterialTrip(req.user.companyId, body);
  }

  // GET: /production -> View the history
  @Roles(Role.COMPANY_OWNER, Role.FLEET_MANAGER)
  @Get()
  getProductionHistory(@Request() req) {
    return this.productionService.getCompanyProductionLogs(req.user.companyId);
  }
}