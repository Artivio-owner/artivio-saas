/**
 * ============================================
 * WAREHOUSE CONTRACTS
 * ============================================
 */

export interface Warehouse {
  id: string;
  name: string;
}

export interface WarehouseStock {
  warehouseId: string;
  warehouseName: string;
  productId?: string;
  materialId?: string;
  quantity: number;
  reserved: number;
  available: number;
}

export type StockMovementType =
  | 'IN'
  | 'OUT'
  | 'RESERVE'
  | 'RELEASE';

export interface StockMovement {
  id: string;
  warehouseId: string;
  productId?: string;
  materialId?: string;
  type: StockMovementType;
  quantity: number;
  reason?: string;
  createdAt: string;
}