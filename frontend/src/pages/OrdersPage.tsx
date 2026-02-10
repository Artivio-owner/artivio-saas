/**
 * ============================================
 * ARTIVIO — ORDERS PAGE
 * ============================================
 */

import { useEffect, useState } from 'react';
import { OrdersService } from '../services/orders.service';

import { MarketplaceService } from '../services/marketplace.service';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    OrdersService.list().then(setOrders);
  }, []);

  return (
    <div>
      <h1>Заказы</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Статус</th>
            <th>Маркетплейс</th>
            <th>Этикетка</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.status}</td>
              <td>{o.marketplace?.type || '—'}</td>
              <td>
                {o.marketplace?.labelUrl ? (
                  <a href={o.marketplace.labelUrl} target="_blank">
                    Скачать
                  </a>
                ) : o.isPickup ? (
                  <span>Самовывоз</span>
                ) : (
                  '—'
                )}

                /* внутри таблицы */

<td>
  {o.marketplace ? (
    <button
      onClick={async () => {
        const label = await MarketplaceService.getLabel(
          o.marketplace.type,
          o.marketplace.orderId,
        );
        window.open(label.url);
      }}
    >
      Этикетка
    </button>
  ) : o.isPickup ? (
    <span>Самовывоз (QR)</span>
  ) : (
    '—'
  )}
</td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}