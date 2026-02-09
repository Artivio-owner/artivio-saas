/**
 * ============================================
 * ARTIVIO — AUTH TYPES
 * ============================================
 */

import { Role } from './roles.enum';

export interface AuthUser {
  id: string;
  companyId?: string; // отсутствует у SUPER_ADMIN
  role: Role;
}