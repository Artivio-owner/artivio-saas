/**
 * ============================================
 * ARTIVIO — TELEGRAM SERVICE
 * ============================================
 */

import { Injectable } from '@nestjs/common';
import { NotificationPayload } from './notification.types';

@Injectable()
export class TelegramService {
  async sendIfEnabled(companyId: string, payload: NotificationPayload) {
    // 🔒 Заглушка: проверка интеграции в БД
    // В будущем — бот, токены, чаты
    return;
  }
}