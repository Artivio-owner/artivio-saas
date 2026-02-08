/**
 * ============================================
 * ARTIVIO — DELIVERY TYPES
 * File: delivery.types.ts
 * ============================================
 */

import {
  DeliveryProvider,
  DeliveryStatus,
} from '../integrations.types';

/**
 * Универсальные credentials для служб доставки
 * (каждый провайдер использует свой набор)
 */
export type DeliveryCredentials = {
  apiKey?: string;
  login?: string;
  password?: string;
  accountId?: string;
};

/**
 * DTO для подключения службы доставки
 */
export interface ConnectDeliveryDto {
  provider: DeliveryProvider;
  credentials: DeliveryCredentials;
}

/**
 * DTO для ответа по службе доставки
 */
export interface DeliveryIntegrationDto {
  id: string;
  companyId: string;
  provider: DeliveryProvider;
  status: DeliveryStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Результат расчёта доставки
 */
export interface DeliveryEstimateDto {
  provider: DeliveryProvider;
  minDays: number;
  maxDays: number;
}