/**
 * ============================================
 * ARTIVIO — RBAC DECORATOR
 * ============================================
 */

import { SetMetadata } from '@nestjs/common';
import { CompanyRole } from './roles.enum';

export const COMPANY_ROLES_KEY = 'company_roles';

export const CompanyRoles = (...roles: CompanyRole[]) =>
  SetMetadata(COMPANY_ROLES_KEY, roles);