/**
 * ============================================
 * ARTIVIO — WAREHOUSES SERVICE
 * ============================================
 */

import { api } from './api';

export const WarehousesService = {
  list() {
    return api.get('/warehouses').then((r) => r.data);
  },

  create(name: string) {
    return api.post('/warehouses', { name }).then((r) => r.data);
  },

  generateBarcode(article: string) {
    return api
      .post('/warehouses/barcode', { article }, { responseType: 'arraybuffer' })
      .then((r) => r.data);
  },

  generateQr(article: string) {
    return api.post('/warehouses/qr', { article }).then((r) => r.data);
  },
};