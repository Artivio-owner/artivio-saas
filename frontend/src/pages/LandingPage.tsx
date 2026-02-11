import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LandingsService } from '../services/landings.service';
import LandingRenderer from '../landings/LandingRenderer';

export default function LandingPage() {
  const { i18n } = useTranslation();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    LandingsService.getLanding('home', i18n.language).then((r) =>
      setContent(r.data),
    );
  }, [i18n.language]);

  if (!content) return null;

  return <LandingRenderer blocks={content.blocks} />;
}