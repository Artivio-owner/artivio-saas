import { useEffect, useState } from 'react';
import { AdminService } from '../../services/admin.service';

export default function LandingsPage() {
  const [landings, setLandings] = useState<any[]>([]);

  useEffect(() => {
    AdminService.landings().then((r) => setLandings(r.data));
  }, []);

  return (
    <div>
      <h2>CMS лендингов</h2>

      {landings.map((l) => (
        <div key={l.id}>
          <b>{l.key}</b> [{l.language}]
          <pre>{JSON.stringify(l.content, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
}