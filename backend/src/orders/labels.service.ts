import { PrismaClient } from '@prisma/client';
import { BarcodeService } from '../products/barcode.service';

const prisma = new PrismaClient();
const barcodeService = new BarcodeService();

export class LabelsService {
  async generate(orderItemId: string) {
    const item = await prisma.orderItem.findUnique({
      where: { id: orderItemId },
      include: {
        order: { include: { marketplace: true } },
        product: true,
      },
    });

    if (!item) {
      throw new Error('ORDER_ITEM_NOT_FOUND');
    }

    // 🟦 Marketplace label
    if (item.order.marketplace) {
      return {
        type: 'MARKETPLACE',
        marketplace: item.order.marketplace.code,
        url: `/integrations/${item.order.marketplace.code}/labels/${item.id}`,
      };
    }

    // 🟩 Self pickup → barcode / QR
    return {
      type: 'SELF_PICKUP',
      barcode: await barcodeService.generateBarcode(item.product.article),
      qr: await barcodeService.generateQR(item.product.article),
    };
  }
}