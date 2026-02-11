/**
 * ============================================
 * ARTIVIO — ORDERS SERVICE
 * ============================================
 */

import { api } from './api';

export const OrdersService = {
  list() {
    return api.get('/orders');
  },


  create(data: any) {
    return api.post('/orders', data);
  },

  getLabel(orderItemId: string) {
    return api.get(`/orders/labels/${orderItemId}`);
  },
  
  create(data: {
    warehouseId: string;
    items: { materialId: string; quantity: number }[];
    isPickup: boolean;
    marketplace?: {
      type: string;
      orderId?: string;
      labelUrl?: string;
    };
  }) {
    return api.post('/orders', data).then((r) => r.data);
  },

  markPaid(orderId: string) {
    return api.post(`/orders/${orderId}/pay`).then((r) => r.data);
  },

  cancel(orderId: string) {
    return api.post(`/orders/${orderId}/cancel`).then((r) => r.data);
  },
};
