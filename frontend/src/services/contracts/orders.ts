/**
 * ============================================
 * ORDERS CONTRACTS
 * ============================================
 */

export type OrderStatus =
  | 'CREATED'
  | 'PAID'
  | 'SHIPPED'
  | 'CANCELLED';

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  shippedAt?: string;
  items: OrderItem[];
}
