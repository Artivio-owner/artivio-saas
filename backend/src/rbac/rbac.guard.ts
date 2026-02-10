/**
 * ============================================
 * ARTIVIO — RBAC GUARD
 * ============================================
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { COMPANY_ROLES_KEY } from './rbac.decorator';
import { CompanyRole } from './roles.enum';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.get<CompanyRole[]>(
      COMPANY_ROLES_KEY,
      context.getHandler(),
    );

    if (!allowedRoles) return true;

    const request = context.switchToHttp().getRequest();
    const userRole: CompanyRole | undefined =
      request.user?.companyRole;

    if (!userRole || !allowedRoles.includes(userRole)) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return true;
  }
}