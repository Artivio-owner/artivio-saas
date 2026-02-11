import { useEffect, useState } from 'react';
import { getTenant } from '../utils/tenant.util';
import { LandingsService } from '../services/landings.service';

export default function LandingRenderer() {
  const tenant = getTenant();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    LandingsService.get(tenant, 'ru').then(res => {
      setContent(res.data?.content);
    });
  }, [tenant]);

  if (!content) return null;

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

import { LandingBlock } from './landing.types';
import HeroBlock from './blocks/HeroBlock';
import FeaturesBlock from './blocks/FeaturesBlock';
import CTAButtonBlock from './blocks/CTAButtonBlock';

export default function LandingRenderer({ blocks }: { blocks: LandingBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'hero':
            return <HeroBlock key={i} {...block} />;
          case 'features':
            return <FeaturesBlock key={i} {...block} />;
          case 'cta':
            return <CTAButtonBlock key={i} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}