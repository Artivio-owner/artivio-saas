/**
 * ============================================
 * ARTIVIO — SUPER ADMIN SERVICE
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto, UpdateLandingDto } from './super-admin.types';

@Injectable()
export class SuperAdminService {
  constructor(private readonly prisma: PrismaService) {}

  /* ===================== COMPANIES ===================== */

  companies() {
    return this.prisma.company.findMany({
      include: {
        domains: true,
      },
    });
  }

  async createCompany(dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: {
        name: dto.name,
        plan: dto.plan,
        domains: dto.domain
          ? {
              create: {
                domain: dto.domain,
              },
            }
          : undefined,
      },
    });
  }

  /* ===================== DOMAINS ===================== */

  domains(companyId: string) {
    return this.prisma.domain.findMany({
      where: { companyId },
    });
  }

  /* ===================== PLANS ===================== */

  plans() {
    return this.prisma.plan.findMany();
  }

  /* ===================== LANDINGS ===================== */

  landings() {
    return this.prisma.landing.findMany();
  }

  updateLanding(key: string, dto: UpdateLandingDto) {
    return this.prisma.landing.update({
      where: { key },
      data: {
        content: dto.content,
      },
    });
  }
}