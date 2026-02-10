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