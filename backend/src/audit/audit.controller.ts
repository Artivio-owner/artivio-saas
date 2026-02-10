/**
 * ============================================
 * ARTIVIO — AUDIT CONTROLLER
 * ============================================
 */

import { Controller, Get, Query, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CompanyRoles } from '../rbac/rbac.decorator';
import { CompanyRole } from '../rbac/roles.enum';

@Controller('audit')
export class AuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @CompanyRoles(CompanyRole.ADMIN, CompanyRole.OWNER)
  list(@Req() req: any) {
    return this.prisma.auditLog.findMany({
      where: {
        companyId: req.user.companyId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 200,
    });
  }
}