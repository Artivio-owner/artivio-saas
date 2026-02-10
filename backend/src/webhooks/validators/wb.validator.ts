/**
 * ============================================
 * ARTIVIO — WB WEBHOOK VALIDATOR
 * ============================================
 */

export function validateWbWebhook(
  token: string,
  expected: string,
) {
  return token === expected;
}