/**
 * ============================================
 * ARTIVIO — DOMAIN ENTITY
 * File: domain.entity.ts
 * ============================================
 */

export enum DomainType {
  SUBDOMAIN = 'SUBDOMAIN',
  CUSTOM = 'CUSTOM',
}

export interface DomainEntity {
  id: string;
  domain: string;
  companyId: string;
  type: DomainType;
  isActive: boolean;
}