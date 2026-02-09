/**
 * ============================================
 * ANALYTICS CONTRACTS
 * ============================================
 */

export interface OrdersTurnover {
  totalOrders: number;
  turnover: number;
}

export interface AnalyticsStockSummary {
  warehouseId: string;
  warehouseName: string;
  productId?: string;
  materialId?: string;
  quantity: number;
  reserved: number;
  available: number;
}