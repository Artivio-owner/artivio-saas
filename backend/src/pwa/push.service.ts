/**
 * ============================================
 * ARTIVIO — PUSH SERVICE
 * ============================================
 * Заготовка под web-push (реализация позже)
 */

import { Injectable } from '@nestjs/common';
import { PushSubscriptionDto } from './push.types';

@Injectable()
export class PushService {
  async saveSubscription(
    companyId: string,
    subscription: PushSubscriptionDto,
  ) {
    // 🔒 сохранить в БД
    return;
  }

  async send(companyId: string, payload: any) {
    // 🔒 отправка push
    return;
  }
}