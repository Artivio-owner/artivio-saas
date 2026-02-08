/**
 * ============================================
 * ARTIVIO — YANDEX TYPES
 * File: yandex.types.ts
 * ============================================
 */

/**
 * Данные точки компании на Яндекс Картах
 */
export interface YandexMapPointDto {
  name: string;
  address: string;
  lat: number;
  lng: number;
}

/**
 * Отзыв Яндекс
 */
export interface YandexReviewDto {
  author: string;
  rating: number; // 1–5
  text: string;
  createdAt: Date;
}

/**
 * Комментарий к отзыву
 */
export interface YandexCommentDto {
  author: string;
  text: string;
  createdAt: Date;
}

/**
 * Статистика репутации (задел под аналитику)
 */
export interface YandexReputationStatsDto {
  averageRating: number;
  totalReviews: number;
  positivePercent: number;
}