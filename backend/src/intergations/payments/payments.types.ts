/**
 * ============================================
 * ARTIVIO — PAYMENTS TYPES
 * File: payments.types.ts
 * ============================================
 */

import { PaymentProvider, PaymentStatus } from '../integrations.types';

/**
 * Универсальная структура ключей платёжной системы
 * (каждый провайдер использует свои поля)
 */
export type PaymentCredentials = {
  apiKey?: string;
  secretKey?: string;
  shopId?: string;
  webhookSecret?: string;
};

/**
 * DTO для подключения платёжной системы
 */
export interface ConnectPaymentDto {
  provider: PaymentProvider;
  credentials: PaymentCredentials;
}

/**
 * DTO для ответа по платёжной системе
 */
export interface PaymentIntegrationDto {
  id: string;
  companyId: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Внутренний интерфейс для провайдеров
 * (Stripe, ЮKassa и др.)
 */
export interface PaymentProviderInterface {
  createPayment(data: {
    amount: number;
    currency: string;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<{
    paymentId: string;
    paymentUrl: string;
  }>;

  verifyWebhook(payload: any, signature: string): boolean;
}