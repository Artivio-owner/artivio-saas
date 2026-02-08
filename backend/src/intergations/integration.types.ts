/**
 * ============================================
 * ARTIVIO — INTEGRATIONS TYPES
 * File: integrations.types.ts
 * ============================================
 */

/**
 * Доступные платёжные системы
 */
export enum PaymentProvider {
  STRIPE = 'STRIPE',
  YOOKASSA = 'YOOKASSA',
  CLOUDPAYMENTS = 'CLOUDPAYMENTS',
}

/**
 * Статусы подключения платёжной системы
 */
export enum PaymentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * Доступные сервисы доставки
 */
export enum DeliveryProvider {
  CDEK = 'CDEK',
  BOXBERRY = 'BOXBERRY',
  DPDC = 'DPD',
}

/**
 * Статусы подключения доставки
 */
export enum DeliveryStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * Доступные маркетплейсы
 */
export enum MarketplaceProvider {
  OZON = 'OZON',
  WILDBERRIES = 'WILDBERRIES',
  YANDEX_MARKET = 'YANDEX_MARKET',
}

/**
 * Статусы подключения маркетплейсов
 */
export enum MarketplaceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * Yandex интеграции
 */
export enum YandexServiceType {
  MAPS = 'MAPS',
  REVIEWS = 'REVIEWS',
}