/**
 * ============================================
 * ARTIVIO — WAREHOUSES TYPES
 * File: warehouses.types.ts
 * ============================================
 */

/**
 * Тип склада
 */
export enum WarehouseType {
  MAIN = 'MAIN',
  PRODUCTION = 'PRODUCTION',
  TRANSIT = 'TRANSIT',
}

/**
 * Тип движения товара / материала
 */
export enum StockMovementType {
  IN = 'IN',           // поступление
  OUT = 'OUT',         // списание
  RESERVE = 'RESERVE', // резерв под заказ
  RELEASE = 'RELEASE', // снятие резерва
  ADJUST = 'ADJUST',   // корректировка
}

/**
 * Склад
 */
export interface WarehouseDto {
  id: string;
  companyId: string;
  name: string;
  type: WarehouseType;
  address?: string;
  isActive: boolean;
  createdAt: Date;
}

/**
 * Остаток товара или материала
 */
export interface WarehouseStockDto {
  id: string;
  warehouseId: string;
  productId?: string;
  materialId?: string;
  quantity: number;
  reserved: number;
  updatedAt: Date;
}

/**
 * Движение остатков
 */
export interface StockMovementDto {
  id: string;
  warehouseId: string;
  productId?: string;
  materialId?: string;
  type: StockMovementType;
  quantity: number;
  reason?: string;
  createdAt: Date;
}