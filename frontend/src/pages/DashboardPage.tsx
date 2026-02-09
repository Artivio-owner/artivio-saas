/**
 * ============================================
 * ARTIVIO — DASHBOARD PAGE
 * ============================================
 */

import { useEffect, useState } from 'react';
import { AnalyticsService } from '../services/analytics.service';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    AnalyticsService.orders().then((res) =>
      setData((prev: any) => ({ ...prev, orders: res })),
    );
    AnalyticsService.revenue().then((res) =>
      setData((prev: any) => ({ ...prev, revenue: res })),
    );
  }, []);

  if (!data) return <div>Загрузка...</div>;

  return (
    <div>
      <h1>Dashboard</h1>

      <section>
        <h3>Заказы</h3>
        <div>Всего: {data.orders.totalOrders}</div>
        <div>Завершено: {data.orders.completedOrders}</div>
        <div>Отменено: {data.orders.cancelledOrders}</div>
      </section>

      <section>
        <h3>Выручка</h3>
        <div>Оборот: {data.revenue.totalRevenue}</div>
        <div>Средний чек: {data.revenue.averageOrderValue}</div>
      </section>
    </div>
  );
}