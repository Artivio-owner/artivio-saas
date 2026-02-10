/**
 * ============================================
 * ARTIVIO — SAAS MIDDLEWARE
 * ============================================
 */

import { Request, Response, NextFunction } from 'express';
import { SaaSService } from './saas.service';
import { SaaSRequestContext } from './saas.types';

declare global {
  namespace Express {
    interface Request {
      saas?: SaaSRequestContext;
    }
  }
}

export async function saasMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const host = req.headers.host;

  if (!host) {
    req.saas = { company: null, isPlatform: true };
    return next();
  }

  const context = await SaaSService.resolveCompany(host);
  req.saas = context;

  next();
}