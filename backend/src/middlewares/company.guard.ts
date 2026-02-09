/**
 * ============================================
 * ARTIVIO — COMPANY GUARD
 * ============================================
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class CompanyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const companyId = request.companyId;

    if (!companyId) {
      throw new ForbiddenException(
        'Company context missing',
      );
    }

    return true;
  }
}