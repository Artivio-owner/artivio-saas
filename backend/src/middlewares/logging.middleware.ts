/**
 * ============================================
 * ARTIVIO — LOGGING MIDDLEWARE
 * File: logging.middleware.ts
 * ============================================
 */

import { Request, Response, NextFunction } from 'express';

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const startedAt = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startedAt;

    const logEntry = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip,
      userId: req.context?.userId ?? null,
      companyId: req.context?.companyId ?? null,
    };

    /**
     * На старте — console
     * Позже:
     * - winston
     * - pino
     * - external log storage
     */
    // eslint-disable-next-line no-console
    console.log('[HTTP]', logEntry);
  });

  next();
}