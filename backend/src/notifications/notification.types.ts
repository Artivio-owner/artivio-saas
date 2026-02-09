/**
 * ============================================
 * ARTIVIO — NOTIFICATION TYPES
 * ============================================
 */

export enum NotificationType {
  ORDER_CREATED = 'ORDER_CREATED',
  ORDER_PAID = 'ORDER_PAID',
  ORDER_CANCELLED = 'ORDER_CANCELLED',
  LOW_STOCK = 'LOW_STOCK',
  SAAS_LIMIT = 'SAAS_LIMIT',
}

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  companyId: string;
  metadata?: Record<string, any>;
}