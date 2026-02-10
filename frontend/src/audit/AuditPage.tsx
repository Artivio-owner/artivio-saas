import { useEffect, useState } from 'react';
import { AuditService } from './audit.service';

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    AuditService.list().then(setLogs);
  }, []);

  return (
    <div>
      <h1>Журнал действий</h1>
      <table>
        <thead>
          <tr>
            <th>Дата</th>
            <th>Пользователь</th>
            <th>Действие</th>
            <th>Объект</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(l => (
            <tr key={l.id}>
              <td>{new Date(l.createdAt).toLocaleString()}</td>
              <td>{l.userId}</td>
              <td>{l.action}</td>
              <td>{l.entity}</td>
              <td>{l.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}