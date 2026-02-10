/**
 * ============================================
 * ARTIVIO — SECTION RENDERER
 * ============================================
 */

import {
  HeroBlock,
  FeaturesBlock,
  FooterBlock,
} from './Blocks';

export function SectionRenderer({ section }: any) {
  switch (section.type) {
    case 'hero':
      return <HeroBlock {...section.props} />;

    case 'features':
      return <FeaturesBlock {...section.props} />;

    case 'footer':
      return <FooterBlock {...section.props} />;

    default:
      return null;
  }
}