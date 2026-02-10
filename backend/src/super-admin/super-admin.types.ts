/**
 * ============================================
 * ARTIVIO — SUPER ADMIN TYPES
 * ============================================
 */

export interface CreateCompanyDto {
  name: string;
  plan: string;
  domain?: string;
}

export interface UpdateLandingDto {
  content: any;
}