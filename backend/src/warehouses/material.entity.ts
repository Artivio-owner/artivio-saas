/**
 * ============================================
 * ARTIVIO — MATERIAL / PRODUCT ENTITY
 * ============================================
 */

export interface Material {
  id: string;
  companyId: string;
  name: string;
  article: string; // артикул (обязателен)
  barcode?: string;
  qrCode?: string;
  criticalStock: number;
  createdAt: Date;
}