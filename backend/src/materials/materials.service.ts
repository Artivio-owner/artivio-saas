/**
 * ============================================
 * ARTIVIO — MATERIALS SERVICE
 * File: materials.service.ts
 * ============================================
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Статусы материала
 */
export enum MaterialStatus {
  IN_STOCK = 'IN_STOCK',
  ON_ORDER = 'ON_ORDER',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

@Injectable()
export class MaterialsService {
  constructor(private prisma: PrismaService) {}

  /**
   * --------------------------------------------
   * CREATE MATERIAL
   * --------------------------------------------
   */
  async createMaterial(companyId: string, data: {
    name: string;
    type: string; // MDF, LDSP, veneer, paint, lacquer, etc
    quantity: number;
    criticalQuantity: number;
    extraDays: number;
  }) {
    return this.prisma.material.create({
      data: {
        companyId,
        ...data,
        status: data.quantity > 0 ? MaterialStatus.IN_STOCK : MaterialStatus.OUT_OF_STOCK,
      },
    });
  }

  /**
   * --------------------------------------------
   * GET MATERIAL STATUS
   * --------------------------------------------
   */
  async getMaterialStatus(materialId: string) {
    const material = await this.prisma.material.findUnique({
      where: { id: materialId },
    });

    if (!material) {
      throw new BadRequestException('Материал не найден');
    }

    if (material.quantity <= 0) {
      return {
        status: MaterialStatus.ON_ORDER,
        extraDays: material.extraDays,
      };
    }

    return {
      status: MaterialStatus.IN_STOCK,
      extraDays: 0,
    };
  }

  /**
   * --------------------------------------------
   * WRITE-OFF MATERIALS (ON ORDER ACCEPT)
   * --------------------------------------------
   */
  async writeOffMaterials(
    companyId: string,
    materials: {
      materialId: string;
      amount: number;
    }[],
  ) {
    for (const item of materials) {
      const material = await this.prisma.material.findFirst({
        where: {
          id: item.materialId,
          companyId,
        },
      });

      if (!material) continue;

      await this.prisma.material.update({
        where: { id: material.id },
        data: {
          quantity: material.quantity - item.amount,
          status:
            material.quantity - item.amount <= 0
              ? MaterialStatus.ON_ORDER
              : MaterialStatus.IN_STOCK,
        },
      });
    }
  }

  /**
   * --------------------------------------------
   * CHECK CRITICAL STOCK
   * --------------------------------------------
   * Используется для аналитики и уведомлений
   */
  async checkCriticalStock(companyId: string) {
    return this.prisma.material.findMany({
      where: {
        companyId,
        quantity: {
          lte: this.prisma.material.fields.criticalQuantity,
        },
      },
    });
  }

  /**
   * --------------------------------------------
   * CALCULATE EXTRA DAYS BY MATERIALS
   * --------------------------------------------
   */
  async calculateExtraDays(materialIds: string[]) {
    const materials = await this.prisma.material.findMany({
      where: { id: { in: materialIds } },
    });

    let extraDays = 0;

    for (const material of materials) {
      if (material.status === MaterialStatus.ON_ORDER) {
        extraDays += material.extraDays;
      }
    }

    return extraDays;
  }
}