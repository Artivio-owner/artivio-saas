/**
 * ============================================
 * ARTIVIO — PRODUCTS SERVICE
 * File: products.service.ts
 * ============================================
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MaterialsService } from '../materials/materials.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly materialsService: MaterialsService,
  ) {}

  /**
   * Создание товара
   * Используется:
   * - в админке
   * - при ручном добавлении
   */
  async createProduct(companyId: string, data: {
    name: string;
    description?: string;
    price: number;
    costPrice: number; // себестоимость
    isVipAvailable?: boolean;
    productionFlags?: {
      cutting?: boolean;
      milling?: boolean;
      veneering?: boolean;
      painting?: boolean;
    };
    materials?: {
      materialId: string;
      avgConsumption: number;
    }[];
    badges?: string[];
  }) {
    return this.prisma.product.create({
      data: {
        companyId,
        name: data.name,
        description: data.description,
        price: data.price,
        costPrice: data.costPrice,
        isVipAvailable: data.isVipAvailable ?? false,
        cutting: data.productionFlags?.cutting ?? true,
        milling: data.productionFlags?.milling ?? false,
        veneering: data.productionFlags?.veneering ?? false,
        painting: data.productionFlags?.painting ?? false,
        badges: data.badges ?? [],
        materials: {
          create: data.materials?.map(m => ({
            materialId: m.materialId,
            avgConsumption: m.avgConsumption,
          })) ?? [],
        },
      },
    });
  }

  /**
   * Получение всех товаров компании
   */
  async getProducts(companyId: string) {
    return this.prisma.product.findMany({
      where: { companyId },
      include: {
        materials: {
          include: {
            material: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Получение товара по ID
   */
  async getProductById(companyId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        companyId,
      },
      include: {
        materials: {
          include: {
            material: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product;
  }

  /**
   * Обновление товара
   */
  async updateProduct(
    companyId: string,
    productId: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      costPrice: number;
      isVipAvailable: boolean;
      badges: string[];
    }>,
  ) {
    return this.prisma.product.updateMany({
      where: {
        id: productId,
        companyId,
      },
      data,
    });
  }

  /**
   * Списание материалов при ПРИНЯТИИ заказа
   * Вызывается из OrdersService
   */
  async writeOffMaterialsForProduct(
    companyId: string,
    productId: string,
    quantity: number,
  ) {
    const productMaterials = await this.prisma.productMaterial.findMany({
      where: {
        productId,
        product: { companyId },
      },
    });

    for (const pm of productMaterials) {
      const totalConsumption = pm.avgConsumption * quantity;

      await this.materialsService.writeOffMaterial(
        companyId,
        pm.materialId,
        totalConsumption,
      );
    }
  }

  /**
   * Расчёт прибыли по товару
   */
  calculateProfit(price: number, costPrice: number): number {
    return price - costPrice;
  }

  /**
   * Расчёт выплаты мастеру
   * 5% от себестоимости * кол-во изделий
   */
  calculateMasterReward(costPrice: number, quantity: number): number {
    return costPrice * 0.05 * quantity;
  }

  /**
   * Проверка, является ли товар VIP
   */
  isVipProduct(product: any): boolean {
    return Boolean(product.isVipAvailable);
  }
}

/**
 * ============================================
 * PRODUCTS SERVICE
 * ============================================
 */

import { PrismaClient } from '@prisma/client';
import { generateBarcode, generateQRCode } from '../utils/barcode.util';

const prisma = new PrismaClient();

export class ProductsService {
  static async create(companyId: string, data: any) {
    const barcode = await generateBarcode(data.article);
    const qrCode = await generateQRCode(data.article);

    return prisma.product.create({
      data: {
        ...data,
        barcode,
        qrCode,
        companyId,
      },
    });
  }

  static async list(companyId: string) {
    return prisma.product.findMany({ where: { companyId } });
  }
}