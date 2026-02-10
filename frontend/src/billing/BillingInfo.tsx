import { useEffect, useState } from 'react';
import { BillingService } from './billing.service';

export function BillingInfo() {
  const [limits, setLimits] = useState<any>(null);

  useEffect(() => {
    BillingService.limits().then(setLimits);
  }, []);

  if (!limits) return null;

  return (
    <div>
      <h3>Лимиты тарифа</h3>
      <ul>
        <li>Склады: {limits.warehouses}</li>
        <li>Товары: {limits.products}</li>
        <li>Пользователи: {limits.users}</li>
        <li>Заказы / мес: {limits.ordersPerMonth}</li>
      </ul>
    </div>
  );
}