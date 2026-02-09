/**
 * ============================================
 * COMPANY CONTRACTS
 * ============================================
 */

export interface Company {
  id: string;
  name: string;
  plan: 'FREE' | 'BASIC' | 'PRO';
  createdAt: string;
}