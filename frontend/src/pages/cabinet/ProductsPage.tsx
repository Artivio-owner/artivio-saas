import { useEffect, useState } from 'react';
import { ProductsService } from '../../services/products.service';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    ProductsService.list().then((r) => setProducts(r.data));
  }, []);

  return (
    <div>
      <h2>Товары</h2>

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {p.name} — {p.article} — {p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}