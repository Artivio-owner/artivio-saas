/**
 * ============================================
 * ARTIVIO — STRIPE PROVIDER
 * File: stripe.provider.ts
 * ============================================
 */

import Stripe from 'stripe';
import { PaymentProviderInterface } from '../payments.types';

export class StripeProvider implements PaymentProviderInterface {
  private stripe: Stripe;

  constructor(private readonly apiKey: string) {
    this.stripe = new Stripe(apiKey, {
      apiVersion: '2023-10-16',
    });
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
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: data.currency,
            product_data: {
              name: data.description,
            },
            unit_amount: Math.round(data.amount * 100),
          },
        },
      ],
      metadata: data.metadata,
      success_url: 'https://artivio.ru/payment/success',
      cancel_url: 'https://artivio.ru/payment/cancel',
    });

    return {
      paymentId: session.id,
      paymentUrl: session.url!,
    };
  }

  /**
   * --------------------------------------------------
   * ПРОВЕРКА WEBHOOK
   * --------------------------------------------------
   */
  verifyWebhook(payload: any, signature: string): boolean {
    // Stripe webhook verification делается через SDK
    // Здесь заглушка — реальная проверка будет в контроллере webhook
    return !!payload && !!signature;
  }
}