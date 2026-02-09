/**
 * ============================================
 * ARTIVIO — TELEGRAM TYPES
 * ============================================
 */

export interface TelegramMessagePayload {
  chatId: string;
  text: string;
  parseMode?: 'Markdown' | 'HTML';
}

export interface TelegramCompanyConfig {
  companyId: string;
  chatId: string;
  isActive: boolean;
}