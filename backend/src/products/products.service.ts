/**
 * ============================================
 * ARTIVIO — PRODUCTS SERVICE
 * File: products.service.ts
 * ============================================
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * --------------------------------------------
 * MATERIAL STATUS
 * --------------------------------------------
 */
export enum MaterialStatus {
  IN_STOCK = 'IN_STOCK',
  ON_ORDER = 'ON_ORDER',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

/**
 * --------------------------------------------
 * PRODUCT LABELS (MARKETPLACE STYLE)
 * --------------------------------------------
 */
export enum ProductLabel {
  NEW = 'NEW',
  HIT = 'HIT',
  SALE = 'SALE',
  VIP = 'VIP',
  LIMITED = 'LIMITED',
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  /**
   * --------------------------------------------
   * LIST PRODUCTS (SITE / ADMIN)
   * --------------------------------------------
   */
  async list(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
      include: {
        materials: true,
        labels: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * --------------------------------------------
   * GET SINGLE PRODUCT
   * --------------------------------------------
   */
  async getById(id: string, companyId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, companyId },
      include: {
        materials: true,
        labels: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  /**
   * --------------------------------------------
   * CREATE PRODUCT (ADMIN)
   * --------------------------------------------
   */
  async create(companyId: string, data: {
    name: string;
    description?: string;
    price: number;
    costPrice: number;
    baseProductionDays: number;
    labels?: ProductLabel[];
  }) {
    return this.prisma.product.create({
      data: {
        companyId,
        name: data.name,
        description: data.description,
        price: data.price,
        costPrice: data.costPrice,
        baseProductionDays: data.baseProductionDays,
        labels: {
          create: data.labels?.map(label => ({ label })) || [],
        },
      },
    });
  }

  /**
   * --------------------------------------------
   * UPDATE PRODUCT
   * --------------------------------------------
   */
  async update(
    id: string,
    companyId: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      costPrice: number;
      baseProductionDays: number;
    }>,
  ) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  /**
   * --------------------------------------------
   * SET PRODUCT LABELS
   * --------------------------------------------
   */
  async setLabels(
    productId: string,
    companyId: string,
    labels: ProductLabel[],
  ) {
    await this.prisma.productLabel.deleteMany({
      where: { productId },
    });

    return this.prisma.productLabel.createMany({
      data: labels.map(label => ({
        productId,
        label,
      })),
    });
  }

  /**
   * --------------------------------------------
   * ADD / UPDATE MATERIAL
   * --------------------------------------------
   */
  async upsertMaterial(
    productId: string,
    companyId: string,
    data: {
      name: string;
      status: MaterialStatus;
      extraDays: number;
      avgConsumption: number;
    },
  ) {
    return this.prisma.productMaterial.upsert({
      where: {
        productId_name: {
          productId,
          name: data.name,
        },
      },
      update: {
        status: data.status,
        extraDays: data.extraDays,
        avgConsumption: data.avgConsumption,
      },
      create: {
        productId,
        name: data.name,
        status: data.status,
        extraDays: data.extraDays,
        avgConsumption: data.avgConsumption,
      },
    });
  }

  /**
   * --------------------------------------------
   * CALCULATE TOTAL PRODUCTION DAYS
   * --------------------------------------------
   */
  async calculateProductionDays(productId: string): Promise<number> {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: { materials: true },
    });

    if (!product) return 0;

    const materialsExtra = product.materials.reduce(
      (sum, m) =>
        m.status === MaterialStatus.ON_ORDER
          ? sum + m.extraDays
          : sum,
      0,
    );

    return product.baseProductionDays + materialsExtra;
  }
}