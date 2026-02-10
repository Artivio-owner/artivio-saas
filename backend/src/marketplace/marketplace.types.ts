/**
 * ============================================
 * ARTIVIO — MARKETPLACE TYPES
 * ============================================
 */

export type MarketplaceType = 'ozon' | 'wb' | 'ym' | 'custom';

export interface MarketplaceOrderMeta {
  type: MarketplaceType;
  orderId: string;
  shipmentId?: string;
  labelUrl?: string;
}

export interface MarketplaceLabel {
  url: string;
  format: 'pdf' | 'png';
}