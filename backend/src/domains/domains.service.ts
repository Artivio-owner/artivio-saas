/**
 * ============================================
 * ARTIVIO — DOMAINS SERVICE
 * File: domains.service.ts
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DomainsService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveCompanyByHost(host: string): Promise<string | null> {
    const cleanHost = host.replace(/^www\./, '').toLowerCase();

    const domain = await this.prisma.domain.findFirst({
      where: {
        domain: cleanHost,
        isActive: true,
      },
      select: {
        companyId: true,
      },
    });

    return domain?.companyId ?? null;
  }

  async registerSubdomain(params: {
    companyId: string;
    subdomain: string;
  }) {
    const domain = `${params.subdomain}.artivio.ru`;

    return this.prisma.domain.create({
      data: {
        domain,
        companyId: params.companyId,
        type: 'SUBDOMAIN',
        isActive: true,
      },
    });
  }

  async registerCustomDomain(params: {
    companyId: string;
    domain: string;
  }) {
    return this.prisma.domain.create({
      data: {
        domain: params.domain.toLowerCase(),
        companyId: params.companyId,
        type: 'CUSTOM',
        isActive: false, // активируется после DNS проверки
      },
    });
  }
}