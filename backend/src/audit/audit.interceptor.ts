/**
 * ============================================
 * ARTIVIO — AUDIT INTERCEPTOR
 * ============================================
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly audit: AuditService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ) {
    const req = context.switchToHttp().getRequest();
    const handler = context.getHandler();

    const auditMeta = Reflect.getMetadata(
      'audit',
      handler,
    );

    return next.handle().pipe(
      tap(async (result) => {
        if (auditMeta) {
          await this.audit.log(req, {
            ...auditMeta,
            metadata: {
              resultId: result?.id,
            },
          });
        }
      }),
    );
  }
}