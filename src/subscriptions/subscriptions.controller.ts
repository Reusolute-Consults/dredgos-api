import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

// 1. Secure the entire controller - you MUST be logged in
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  // Only Owners and Fleet Managers can view billing details
  @Roles(Role.COMPANY_OWNER, Role.SUPER_ADMIN)
  @Get('current')
  getCurrentPlan(@Request() req) {
    // req.user is injected automatically by our JWT Strategy!
    return this.subscriptionsService.getCurrentSubscription(req.user.companyId);
  }

  // Any authorized user adding equipment needs to trigger this check
  @Roles(Role.COMPANY_OWNER, Role.FLEET_MANAGER)
  @Get('check-limit')
  checkLimit(@Request() req) {
    return this.subscriptionsService.checkEquipmentLimit(req.user.companyId);
  }
}