/**
 * ============================================
 * ARTIVIO — ANALYTICS TYPES
 * ============================================
 */

export interface OrdersAnalytics {
  totalOrders: number;
  completedOrders: number;
  cancelledOrders: number;
}

export interface RevenueAnalytics {
  totalRevenue: number;
  averageOrderValue: number;
}

export interface WarehouseAnalytics {
  totalWarehouses: number;
  totalStockItems: number;
  lowStockItems: number;
}

export interface SaasUsageAnalytics {
  warehousesUsed: number;
  productsUsed: number;
  usersUsed: number;
}