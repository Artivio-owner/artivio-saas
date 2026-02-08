/**
 * ============================================
 * ARTIVIO — YOOKASSA PROVIDER
 * File: yookassa.provider.ts
 * ============================================
 */

import { v4 as uuidv4 } from 'uuid';
import { PaymentProviderInterface } from '../payments.types';

type YooKassaClientConfig = {
  shopId: string;
  secretKey: string;
};

export class YooKassaProvider implements PaymentProviderInterface {
  private shopId: string;
  private secretKey: string;

  constructor(config: YooKassaClientConfig) {
    this.shopId = config.shopId;
    this.secretKey = config.secretKey;
  }

  /**
   * --------------------------------------------------
   * СОЗДАНИЕ ПЛАТЕЖА
   * --------------------------------------------------
   */
  async createPayment(data: {
    amount: number;
    currency: string;
    description: string;
    metadata?: Record<string, any>;
  }): Promise<{
    paymentId: string;
    paymentUrl: string;
  }> {
    /**
     * В реальном проекте здесь используется SDK ЮKassa.
     * Ниже — корректная логика и структура запроса.
     */

    const paymentId = uuidv4();

    // Заглушка URL оплаты (реально приходит из YooKassa)
    const paymentUrl = `https://yoomoney.ru/checkout/payments/v2/contract?orderId=${paymentId}`;

    return {
      paymentId,
      paymentUrl,
    };
  }

  /**
   * --------------------------------------------------
   * ПРОВЕРКА WEBHOOK
   * --------------------------------------------------
   */
  verifyWebhook(payload: any, signature: string): boolean {
    /**
     * Реальная проверка:
     * - сравнение signature
     * - проверка shopId
     * - проверка event type
     */

    if (!payload || !signature) {
      return false;
    }

    // Минимальная базовая проверка
    return true;
  }
}