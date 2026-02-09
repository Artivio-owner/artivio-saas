/**
 * ============================================
 * ARTIVIO — WAREHOUSE SERVICE
 * ============================================
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaasService } from '../saas/saas.service';

@Injectable()
export class WarehouseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly saasService: SaasService,
  ) {}

  async createWarehouse(companyId: string, name: string) {
    const count = await this.prisma.warehouse.count({ where: { companyId } });
    await this.saasService.assertLimit({
      companyId,
      type: 'warehouses',
      current: count,
    });

    return this.prisma.warehouse.create({
      data: {
        companyId,
        name,
        isDefault: count === 0,
      },
    });
  }

  async getCompanyWarehouses(companyId: string) {
    return this.prisma.warehouse.findMany({ where: { companyId } });
  }
}