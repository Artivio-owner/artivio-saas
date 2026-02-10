/**
 * ============================================
 * ARTIVIO — SCAN SERVICE
 * ============================================
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScanService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveByArticle(article: string) {
    const product = await this.prisma.product.findUnique({
      where: { article },
    });

    if (!product) {
      throw new NotFoundException('Товар не найден');
    }

    return product;
  }

  async attachToOrder(orderId: string, article: string) {
    const product = await this.resolveByArticle(article);

    return this.prisma.orderItem.updateMany({
      where: {
        orderId,
        productId: product.id,
      },
      data: {
        scannedAt: new Date(),
      },
    });
  }
}