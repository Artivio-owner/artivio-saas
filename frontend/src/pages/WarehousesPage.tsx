/**
 * ============================================
 * ARTIVIO — WAREHOUSES PAGE
 * ============================================
 */

import { useEffect, useState } from 'react';
import { WarehousesService } from '../services/warehouses.service';

export default function WarehousesPage() {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    WarehousesService.list().then(setWarehouses);
  }, []);

  async function create() {
    await WarehousesService.create(name);
    setName('');
    setWarehouses(await WarehousesService.list());
  }

  return (
    <div>
      <h1>Склады</h1>

      <input
        placeholder="Название склада"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={create}>Добавить</button>

      <ul>
        {warehouses.map((w) => (
          <li key={w.id}>{w.name}</li>
        ))}
      </ul>
    </div>
  );
}