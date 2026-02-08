/**
 * ============================================
 * ARTIVIO — REQUEST CONTEXT MIDDLEWARE
 * File: request-context.middleware.ts
 * ============================================
 */

import { Request, Response, NextFunction } from 'express';

export interface RequestContext {
  userId?: string;
  companyId?: string;
  role?: string;
}

declare global {
  namespace Express {
    interface Request {
      context?: RequestContext;
    }
  }
}

/**
 * ------------------------------------------------
 * Middleware: Request Context
 * ------------------------------------------------
 * Источники данных:
 * - JWT (req.user) — если auth уже отработал
 * - headers (fallback)
 */
export function requestContextMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const context: RequestContext = {};

  /**
   * --------------------------------------------
   * JWT payload (основной вариант)
   * --------------------------------------------
   */
  if ((req as any).user) {
    const user = (req as any).user;

    context.userId = user.id;
    context.companyId = user.companyId;
    context.role = user.role;
  }

  /**
   * --------------------------------------------
   * Fallback через headers (service-to-service)
   * --------------------------------------------
   */
  if (!context.companyId && req.headers['x-company-id']) {
    context.companyId = String(req.headers['x-company-id']);
  }

  if (!context.userId && req.headers['x-user-id']) {
    context.userId = String(req.headers['x-user-id']);
  }

  req.context = context;

  next();
}