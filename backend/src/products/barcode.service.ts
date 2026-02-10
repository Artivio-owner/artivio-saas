import QRCode from 'qrcode';
import bwipjs from 'bwip-js';

export class BarcodeService {
  async generateQR(article: string): Promise<string> {
    return QRCode.toDataURL(article);
  }

  async generateBarcode(article: string): Promise<Buffer> {
    return bwipjs.toBuffer({
      bcid: 'code128',
      text: article,
      scale: 3,
      height: 10,
    });
  }
}