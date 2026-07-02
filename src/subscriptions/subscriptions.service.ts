import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(private prisma: PrismaService) {}

  // 1. Get current subscription details for a company
  async getCurrentSubscription(companyId: string) {
    const sub = await this.prisma.subscription.findFirst({
      where: { companyId, status: 'ACTIVE' },
      include: { plan: true }, // Joins the SubscriptionPlan table to get limits & pricing
    });

    if (!sub) {
      throw new NotFoundException('No active subscription found. Please select a plan.');
    }

    return sub;
  }

  // 2. The Core SaaS Enforcement Rule
  async checkEquipmentLimit(companyId: string) {
    // Get their active plan
    const subscription = await this.getCurrentSubscription(companyId);
    const limit = subscription.plan.maxEquipmentLimit;

    // Count how many machines they currently have registered
    const currentFleetCount = await this.prisma.equipment.count({
      where: { companyId },
    });

    // Enforce the boundary
    if (currentFleetCount >= limit) {
      throw new ForbiddenException(
        `Upgrade required. Your current plan limits you to ${limit} assets. You currently have ${currentFleetCount}.`
      );
    }

    return { allowed: true, current: currentFleetCount, limit };
  }
}