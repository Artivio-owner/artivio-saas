/**
 * ============================================
 * NOTIFICATIONS CONTRACTS
 * ============================================
 */

export type NotificationType =
  | 'LOW_STOCK'
  | 'ORDER_ERROR'
  | 'SYSTEM';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}