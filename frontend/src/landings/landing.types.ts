export type LandingBlock =
  | { type: 'hero'; title: string; subtitle?: string }
  | { type: 'features'; items: string[] }
  | { type: 'cta'; text: string; url: string };

export type LandingContent = {
  blocks: LandingBlock[];
};