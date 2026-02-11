import { useEffect, useState } from 'react';
import { AdminService } from '../../services/admin.service';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    AdminService.companies().then((r) => setCompanies(r.data));
  }, []);

  return (
    <div>
      <h2>Компании</h2>
      <ul>
        {companies.map((c) => (
          <li key={c.id}>
            {c.name} — {c.domain}
          </li>
        ))}
      </ul>
    </div>
  );
}