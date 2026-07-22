import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

// Lock down the entire controller
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  // Only Owners and Fleet Managers can add new machinery
  @Roles(Role.COMPANY_OWNER, Role.FLEET_MANAGER)
  @Post()
  create(@Request() req, @Body() body: any) {
    return this.equipmentService.createEquipment(req.user.companyId, body);
  }

  // Supervisors need to see the fleet, but they can't add new ones
  @Roles(Role.COMPANY_OWNER, Role.FLEET_MANAGER, Role.SITE_SUPERVISOR)
  @Get()
  findAll(@Request() req) {
    return this.equipmentService.findAllForCompany(req.user.companyId);
  }

  // Supervisors must be able to change status to BROKEN_DOWN from the field
  @Roles(Role.COMPANY_OWNER, Role.FLEET_MANAGER, Role.SITE_SUPERVISOR)
  @Patch(':id/status')
  updateStatus(@Request() req, @Param('id') id: string, @Body('status') status: string) {
    return this.equipmentService.updateEquipmentStatus(req.user.companyId, id, status);
  }
}