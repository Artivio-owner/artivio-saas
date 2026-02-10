/**
 * ============================================
 * BARCODE / QR GENERATOR
 * ============================================
 */

import QRCode from 'qrcode';
import bwipjs from 'bwip-js';

export async function generateQRCode(text: string): Promise<string> {
  return QRCode.toDataURL(text);
}

export async function generateBarcode(text: string): Promise<string> {
  const png = await bwipjs.toBuffer({
    bcid: 'code128',
    text,
    scale: 3,
    height: 10,
    includetext: true,
  });

  return `data:image/png;base64,${png.toString('base64')}`;
}