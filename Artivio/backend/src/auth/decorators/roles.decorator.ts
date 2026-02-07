/**
 * ============================================
 * ARTIVIO — ROLES DECORATOR
 * File: roles.decorator.ts
 * ============================================
 */

import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../guards/roles.guard';

/**
 * --------------------------------------------
 * ROLES DECORATOR
 * --------------------------------------------
 * Usage:
 * @Roles(UserRole.ADMIN, UserRole.MANAGER)
 */
export const Roles = (...roles: UserRole[]) =>
  SetMetadata('roles', roles);