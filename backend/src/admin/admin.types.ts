/**
 * ============================================
 * ARTIVIO — ADMIN TYPES
 * ============================================
 */

export interface CreateCompanyDto {
  name: string;
  slug: string;
  domain?: string;
}