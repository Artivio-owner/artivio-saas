/**
 * ============================================
 * ARTIVIO — LANDING TYPES
 * ============================================
 */

export interface Landing {
  key: string;
  content: LandingContent;
}

export interface LandingContent {
  title?: string;
  sections: Section[];
}

export interface Section {
  type: string;
  props: Record<string, any>;
}