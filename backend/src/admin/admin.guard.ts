/**
 * ============================================
 * ADMIN GUARD (SUPER ADMIN)
 * ============================================
 */

import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const user = req.user;
    if (!user || user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('SUPER_ADMIN_ONLY');
    }

    return true;
  }
}