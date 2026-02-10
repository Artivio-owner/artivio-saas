/**
 * ============================================
 * ARTIVIO — COMPANIES
 * ============================================
 */

import { useEffect, useState } from 'react';
import { AdminService } from '../services/admin.service';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    AdminService.companies().then(setCompanies);
  }, []);

  return (
    <div>
      <h1>Компании</h1>
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Тариф</th>
            <th>Домены</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.plan}</td>
              <td>{c.domains?.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}