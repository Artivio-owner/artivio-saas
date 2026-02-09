/**
 * ============================================
 * ARTIVIO — SAAS TYPES
 * File: saas.types.ts
 * ============================================
 */

/**
 * Тарифы компаний
 */
export enum TariffPlan {
  FREE_TRIAL = 'FREE_TRIAL', // 7 дней, полный доступ
  START = 'START',          // базовый функционал
  FACTORY = 'FACTORY',      // полный доступ
}

/**
 * Платные дополнительные модули
 */
export enum AddonModule {
  SITE = 'SITE',            // сайт как шаблон
  ANALYTICS = 'ANALYTICS',
  PRODUCTION = 'PRODUCTION',
  ACCOUNTING = 'ACCOUNTING',
  SUPPORT = 'SUPPORT',
}

/**
 * Фичи (мелкие переключатели)
 */
export enum FeatureFlag {
  MANUAL_ORDERS = 'MANUAL_ORDERS',
  EXPORT_DATA = 'EXPORT_DATA',
  IMPORT_DATA = 'IMPORT_DATA',
  DOMAIN_BINDING = 'DOMAIN_BINDING',
  API_ACCESS = 'API_ACCESS',
}

/**
 * Полный профиль тарифа
 */
export type TariffProfile = {
  plan: TariffPlan;
  durationDays: number;
  price: number;

  modules: AddonModule[];
  features: FeatureFlag[];
};

/**
 * Каноническое описание тарифов
 */
export const TARIFFS: Record<TariffPlan, TariffProfile> = {
  [TariffPlan.FREE_TRIAL]: {
    plan: TariffPlan.FREE_TRIAL,
    durationDays: 7,
    price: 0,
    modules: [
      AddonModule.SITE,
      AddonModule.ANALYTICS,
      AddonModule.PRODUCTION,
      AddonModule.ACCOUNTING,
      AddonModule.SUPPORT,
    ],
    features: [
      FeatureFlag.MANUAL_ORDERS,
      FeatureFlag.EXPORT_DATA,
      FeatureFlag.IMPORT_DATA,
      FeatureFlag.DOMAIN_BINDING,
      FeatureFlag.API_ACCESS,
    ],
  },

  [TariffPlan.START]: {
    plan: TariffPlan.START,
    durationDays: 30,
    price: 0, // задаётся позже
    modules: [
      AddonModule.PRODUCTION,
      AddonModule.ANALYTICS,
    ],
    features: [
      FeatureFlag.MANUAL_ORDERS,
      FeatureFlag.EXPORT_DATA,
    ],
  },

  [TariffPlan.FACTORY]: {
    plan: TariffPlan.FACTORY,
    durationDays: 30,
    price: 0, // задаётся позже
    modules: Object.values(AddonModule),
    features: Object.values(FeatureFlag),
  },
};