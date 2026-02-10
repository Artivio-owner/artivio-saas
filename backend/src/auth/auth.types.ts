/**
 * ============================================
 * ARTIVIO — AUTH TYPES
 * ============================================
 */

import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  role: Role;
  companyId?: string | null;
}