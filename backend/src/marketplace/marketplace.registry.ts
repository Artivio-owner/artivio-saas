/**
 * ============================================
 * ARTIVIO — MARKETPLACE REGISTRY
 * ============================================
 */

import { OzonAdapter } from './adapters/ozon.adapter';
import { WbAdapter } from './adapters/wb.adapter';

export const marketplaceRegistry = {
  ozon: new OzonAdapter(),
  wb: new WbAdapter(),
};