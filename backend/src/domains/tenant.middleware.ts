/**
 * ============================================
 * ARTIVIO — TENANT RESOLVER MIDDLEWARE
 * File: tenant.middleware.ts
 * ============================================
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { DomainsService } from './domains.service';

export interface TenantRequest extends Request {
  companyId?: string;
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly domainsService: DomainsService) {}

  async use(req: TenantRequest, _: Response, next: NextFunction) {
    const host = req.headers.host;
    if (!host) {
      return next();
    }

    const companyId = await this.domainsService.resolveCompanyByHost(host);

    if (companyId) {
      req.companyId = companyId;
    }

    next();
  }
}