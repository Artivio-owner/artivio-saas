/**
 * ============================================
 * ARTIVIO — AUDIT SERVICE
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditPayload } from './audit.types';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(
    req: any,
    payload: AuditPayload,
  ) {
    const user = req.user;

    return this.prisma.auditLog.create({
      data: {
        companyId: user?.companyId,
        userId: user?.id,
        role: user?.companyRole,
        action: payload.action,
        entity: payload.entity,
        entityId: payload.entityId,
        metadata: payload.metadata,
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });
  }
}