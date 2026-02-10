/**
 * ============================================
 * ARTIVIO — LANDINGS MANAGER
 * ============================================
 */

import { useEffect, useState } from 'react';
import { AdminService } from '../services/admin.service';

export default function LandingsPage() {
  const [landings, setLandings] = useState<any[]>([]);

  useEffect(() => {
    AdminService.landings().then(setLandings);
  }, []);

  return (
    <div>
      <h1>Лендинги</h1>
      {landings.map(l => (
        <div key={l.key}>
          <h3>{l.key}</h3>
          <textarea defaultValue={JSON.stringify(l.content, null, 2)} />
        </div>
      ))}
    </div>
  );
}