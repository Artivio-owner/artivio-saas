/**
 * ============================================
 * ARTIVIO — LANDING PAGE
 * ============================================
 */

import { useEffect, useState } from 'react';
import { LandingService } from './landing.service';
import { SectionRenderer } from './components/SectionRenderer';
import { Landing } from './types';

export default function LandingPage() {
  const [landing, setLanding] = useState<Landing | null>(null);

  useEffect(() => {
    LandingService.load().then(setLanding);
  }, []);

  if (!landing) return <div />;

  return (
    <div>
      {landing.content.sections.map((section, idx) => (
        <SectionRenderer key={idx} section={section} />
      ))}
    </div>
  );
}