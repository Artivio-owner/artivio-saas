/**
 * ============================================
 * ARTIVIO — COMPANY MIDDLEWARE
 * ============================================
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CompanyMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const companyId =
      req.headers['x-company-id'] ||
      req.query.companyId;

    if (companyId) {
      (req as any).companyId = companyId;
    }

    next();
  }
}