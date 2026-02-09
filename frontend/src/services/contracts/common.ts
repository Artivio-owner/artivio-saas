/**
 * ============================================
 * COMMON CONTRACTS
 * ============================================
 */

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface DateRange {
  from?: string; // ISO
  to?: string;   // ISO
}