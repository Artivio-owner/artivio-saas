/**
 * ============================================
 * ARTIVIO — INVENTORY SERVICE
 * ============================================
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async reserveMaterial(params: {
    warehouseId: string;
    materialId: string;
    quantity: number;
  }) {
    const item = await this.prisma.inventory.findFirst({
      where: {
        warehouseId: params.warehouseId,
        materialId: params.materialId,
      },
    });

    if (!item || item.quantity - item.reserved < params.quantity) {
      throw new BadRequestException('Not enough stock');
    }

    return this.prisma.inventory.update({
      where: { id: item.id },
      data: {
        reserved: item.reserved + params.quantity,
      },
    });
  }

  async commitReservation(params: {
    warehouseId: string;
    materialId: string;
    quantity: number;
  }) {
    const item = await this.prisma.inventory.findFirst({
      where: {
        warehouseId: params.warehouseId,
        materialId: params.materialId,
      },
    });

    if (!item || item.reserved < params.quantity) {
      throw new BadRequestException('Invalid reservation');
    }

    return this.prisma.inventory.update({
      where: { id: item.id },
      data: {
        quantity: item.quantity - params.quantity,
        reserved: item.reserved - params.quantity,
      },
    });
  }

  async rollbackReservation(params: {
    warehouseId: string;
    materialId: string;
    quantity: number;
  }) {
    const item = await this.prisma.inventory.findFirst({
      where: {
        warehouseId: params.warehouseId,
        materialId: params.materialId,
      },
    });

    if (!item || item.reserved < params.quantity) {
      return;
    }

    return this.prisma.inventory.update({
      where: { id: item.id },
      data: {
        reserved: item.reserved - params.quantity,
      },
    });
  }
}