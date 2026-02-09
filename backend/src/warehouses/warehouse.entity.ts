/**
 * ============================================
 * ARTIVIO — WAREHOUSE ENTITY
 * ============================================
 */

export interface Warehouse {
  id: string;
  companyId: string;
  name: string;
  isDefault: boolean;
  createdAt: Date;
}