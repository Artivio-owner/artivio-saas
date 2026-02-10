/**
 * ============================================
 * ARTIVIO — OZON WEBHOOK VALIDATOR
 * ============================================
 */

import * as crypto from 'crypto';

export function validateOzonWebhook(
  body: any,
  signature: string,
  secret: string,
) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(body))
    .digest('hex');

  return hash === signature;
}