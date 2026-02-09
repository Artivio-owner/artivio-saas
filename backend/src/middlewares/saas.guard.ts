/**
 * ============================================
 * ARTIVIO — SAAS GUARD
 * ============================================
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { SaasService } from '../saas/saas.service';

@Injectable()
export class SaasGuard implements CanActivate {
  constructor(private readonly saas: SaasService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const companyId = request.companyId;

    // example hook point
    // real limit checks are called from services
    if (!companyId) return false;

    return true;
  }
}