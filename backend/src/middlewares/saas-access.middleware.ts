/**
 * ============================================
 * ARTIVIO — SAAS ACCESS MIDDLEWARE
 * File: saas-access.middleware.ts
 * ============================================
 */

import {
  Request,
  Response,
  NextFunction,
} from 'express';
import {
  ForbiddenException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';

import { SaasService } from '../saas/saas.service';
import { AddonModule } from '../saas/saas.types';

/**
 * ------------------------------------------------
 * Middleware Factory
 * ------------------------------------------------
 * Позволяет указывать требуемый модуль:
 *
 * app.use(
 *   '/integrations',
 *   saasAccessMiddleware(AddonModule.INTEGRATIONS)
 * )
 */
@Injectable()
export class SaasAccessMiddleware
  implements NestMiddleware
{
  constructor(
    private readonly saasService: SaasService,
  ) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const requiredModule: AddonModule | undefined =
      (req as any).requiredSaasModule;

    if (!requiredModule) {
      return next();
    }

    const companyId = req.context?.companyId;

    if (!companyId) {
      throw new ForbiddenException(
        'Company context required',
      );
    }

    const hasAccess =
      this.saasService.hasModuleAccess(
        companyId,
        requiredModule,
      );

    if (!hasAccess) {
      throw new ForbiddenException(
        `SaaS module "${requiredModule}" is not available in your plan`,
      );
    }

    next();
  }
}