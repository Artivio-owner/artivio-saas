/**
 * ============================================
 * ARTIVIO — BILLING GUARD
 * ============================================
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { BillingService } from './billing.service';

@Injectable()
export class BillingGuard implements CanActivate {
  constructor(private readonly billing: BillingService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const companyId = req.user?.companyId;

    if (!companyId) return true;

    const sub = await this.billing.getSubscription(companyId);
    if (!sub || sub.status !== 'ACTIVE') {
      return false;
    }

    return true;
  }
}