/**
 * ============================================
 * ARTIVIO — INVENTORY ENTITY
 * ============================================
 */

export interface InventoryItem {
  id: string;
  warehouseId: string;
  materialId: string;
  quantity: number;
  reserved: number;
}