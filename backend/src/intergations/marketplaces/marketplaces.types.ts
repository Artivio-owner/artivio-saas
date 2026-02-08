/**
 * ============================================
 * ARTIVIO — MARKETPLACES TYPES
 * File: marketplaces.types.ts
 * ============================================
 */

import {
  MarketplaceProvider,
  MarketplaceStatus,
} from '../integrations.types';

/**
 * Универсальные credentials маркетплейсов
 * (набор полей зависит от конкретного API)
 */
export type MarketplaceCredentials = {
  apiKey?: string;
  clientId?: string;
  clientSecret?: string;
  campaignId?: string;
  warehouseId?: string;
};

/**
 * DTO для подключения маркетплейса
 */
export interface ConnectMarketplaceDto {
  provider: MarketplaceProvider;
  credentials: MarketplaceCredentials;
}

/**
 * DTO ответа по маркетплейсу
 */
export interface MarketplaceIntegrationDto {
  id: string;
  companyId: string;
  provider: MarketplaceProvider;
  status: MarketplaceStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Результат синхронизации
 */
export interface MarketplaceSyncResultDto {
  provider: MarketplaceProvider;
  syncedProducts?: number;
  syncedOrders?: number;
  status: 'ok' | 'error';
  errorMessage?: string;
}