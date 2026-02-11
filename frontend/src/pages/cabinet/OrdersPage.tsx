import { useEffect, useState } from 'react';
import { OrdersService } from '../../services/orders.service';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    OrdersService.list().then((r) => setOrders(r.data));
  }, []);

  return (
    <div>
      <h2>Заказы</h2>

      {orders.map((o) => (
        <div key={o.id}>
          <h4>Заказ {o.id}</h4>
          <div>
            {o.marketplace
              ? `Маркетплейс: ${o.marketplace.name}`
              : 'Самовывоз'}
          </div>

          <ul>
            {o.items.map((i: any) => (
              <li key={i.id}>
                {i.product.name} × {i.quantity}
                <button
                  onClick={() =>
                    OrdersService.getLabel(i.id).then(console.log)
                  }
                >
                  Скачать этикетку
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}