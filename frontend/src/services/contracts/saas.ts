/**
 * ============================================
 * SAAS CONTRACTS
 * ============================================
 */

export type SaasPlan = 'FREE' | 'BASIC' | 'PRO';

export interface SaasLimits {
  warehouses: number;
  products: number;
  ordersPerMonth: number;
  users: number;
}

export interface SaasInfo {
  plan: SaasPlan;
  limits: SaasLimits;
}