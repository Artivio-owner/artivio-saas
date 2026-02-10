/**
 * ============================================
 * ARTIVIO — WEBHOOK TYPES
 * ============================================
 */

export type MarketplaceWebhookType = 'ozon' | 'wb' | 'ym';

export interface WebhookPayload {
  type: MarketplaceWebhookType;
  event: string;
  data: any;
}