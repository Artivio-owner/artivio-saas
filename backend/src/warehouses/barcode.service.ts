/**
 * ============================================
 * ARTIVIO — BARCODE & QR SERVICE
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as bwipjs from 'bwip-js';

@Injectable()
export class BarcodeService {
  async generateBarcode(article: string): Promise<Buffer> {
    return bwipjs.toBuffer({
      bcid: 'code128',
      text: article,
      scale: 3,
      height: 10,
    });
  }

  async generateQr(article: string): Promise<string> {
    return QRCode.toDataURL(article);
  }
}