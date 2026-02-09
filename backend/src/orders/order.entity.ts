/**
 * ============================================
 * ARTIVIO — ORDER ENTITY
 * ============================================
 */

export enum OrderStatus {
  NEW = 'NEW',
  RESERVED = 'RESERVED',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export type MarketplaceType = 'ozon' | 'wb' | 'ym' | 'custom';

export interface MarketplaceInfo {
  type: MarketplaceType;
  orderId?: string;
  shipmentId?: string;
  labelUrl?: string; // ссылка на этикетку МП
}

export interface OrderItem {
  materialId: string;
  quantity: number;
}

export interface Order {
  id: string;
  companyId: string;
  warehouseId: string;
  status: OrderStatus;
  items: OrderItem[];
  marketplace?: MarketplaceInfo;
  isPickup: boolean; // самовывоз
  createdAt: Date;
}