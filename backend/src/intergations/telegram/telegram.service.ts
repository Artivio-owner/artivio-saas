/**
 * ============================================
 * ARTIVIO — TELEGRAM SERVICE
 * ============================================
 */

import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { TelegramMessagePayload } from './telegram.types';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly apiUrl: string;

  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not defined');
    }

    this.apiUrl = `https://api.telegram.org/bot${token}`;
  }

  async sendMessage(payload: TelegramMessagePayload) {
    try {
      await axios.post(`${this.apiUrl}/sendMessage`, {
        chat_id: payload.chatId,
        text: payload.text,
        parse_mode: payload.parseMode ?? 'Markdown',
      });
    } catch (error) {
      this.logger.error(
        'Telegram sendMessage failed',
        error?.response?.data || error.message,
      );
    }
  }
}