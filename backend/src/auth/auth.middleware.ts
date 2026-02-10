/**
 * ============================================
 * ARTIVIO — AUTH MIDDLEWARE
 * ============================================
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
        companyId?: string | null;
      };
    }
  }
}

export function authRequired(
  roles?: Role[]
) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ message: 'No token' });

    const token = auth.replace('Bearer ', '');

    try {
      const payload = AuthService.verifyToken(token);

      // RBAC
      if (roles && !roles.includes(payload.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // SaaS isolation
      if (
        payload.role !== Role.SUPER_ADMIN &&
        req.saas?.company &&
        payload.companyId !== req.saas.company.id
      ) {
        return res.status(403).json({ message: 'Wrong tenant' });
      }

      req.user = {
        id: payload.userId,
        role: payload.role,
        companyId: payload.companyId,
      };

      next();
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}