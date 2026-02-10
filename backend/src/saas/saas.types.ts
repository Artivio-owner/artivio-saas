/**
 * ============================================
 * ARTIVIO — SAAS TYPES (CORE)
 * File: saas.types.ts
 * ============================================
 */

export enum SaasPlan {
  FREE = 'FREE',
  BASIC = 'BASIC',
  PRO = 'PRO',
}

export interface SaasLimits {
  warehouses: number;
  products: number;
  ordersPerMonth: number;
  users: number;
}

export interface SaasFeatureFlags {
  analytics: boolean;
  warehouses: boolean;
  orders: boolean;
  notifications: boolean;
  marketingIntegrations: boolean;
  pwa: boolean;
  helpdesk: boolean;
}

export interface SaasCompany {
  id: string;
  name: string;
  plan: SaasPlan;
  limits: SaasLimits;
  features: SaasFeatureFlags;
}

/**
 * ============================================
 * ARTIVIO — SAAS TYPES
 * ============================================
 */

import { Company } from '@prisma/client';

export interface SaaSRequestContext {
  company: Company | null;
  isPlatform: boolean; // artivio.ru
}

/**
 * ============================================
 * SAAS TYPES (CANON)
 * ============================================
 */

export type SaaSProduct = 'furnicore' | 'furnislicer';

export interface SaaSTenant {
  id: string;
  companyId: string | null;
  domain: string;
  product: SaaSProduct;
  isWhiteLabel: boolean;
}