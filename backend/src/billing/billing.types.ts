/**
 * ============================================
 * ARTIVIO — BILLING TYPES
 * ============================================
 */

export type PlanCode = 'FREE' | 'PRO' | 'ENTERPRISE';

export interface PlanLimits {
  warehouses: number;
  products: number;
  users: number;
  ordersPerMonth: number;
}