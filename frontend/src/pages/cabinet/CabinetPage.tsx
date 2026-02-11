import { Link } from 'react-router-dom';

export default function CabinetPage() {
  return (
    <div>
      <h1>Кабинет</h1>
      <nav>
        <Link to="/products">Товары</Link> |{' '}
        <Link to="/orders">Заказы</Link> |{' '}
        <Link to="/admin">Админка</Link>
      </nav>
    </div>
  );
}