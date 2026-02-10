/**
 * ============================================
 * ARTIVIO — AUDIT TYPES
 * ============================================
 */

export interface AuditPayload {
  action: string;
  entity: string;
  entityId?: string;
  metadata?: any;
}