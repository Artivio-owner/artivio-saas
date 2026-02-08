/**
 * ============================================
 * ARTIVIO — COMPANY GUARD MIDDLEWARE
 * File: company-guard.middleware.ts
 * ============================================
 */

import { Request, Response, NextFunction } from 'express';
import { ForbiddenException } from '@nestjs/common';

/**
 * ------------------------------------------------
 * Middleware: Company Guard
 * ------------------------------------------------
 * Проверяет, что:
 * - companyId в URL
 * - companyId в контексте пользователя
 * - они совпадают
 */
export function companyGuardMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const contextCompanyId = req.context?.companyId;
  const routeCompanyId =
    req.params.companyId || req.body.companyId;

  /**
   * Если маршрут не связан с компанией — пропускаем
   */
  if (!routeCompanyId) {
    return next();
  }

  /**
   * Нет companyId в контексте — запрещаем
   */
  if (!contextCompanyId) {
    throw new ForbiddenException(
      'Company context not found',
    );
  }

  /**
   * Несовпадение companyId — запрещаем
   */
  if (contextCompanyId !== routeCompanyId) {
    throw new ForbiddenException(
      'Access to foreign company is forbidden',
    );
  }

  next();
}