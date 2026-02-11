import { Link } from 'react-router-dom';

export default function AdminPage() {
  return (
    <div>
      <h1>Super Admin</h1>
      <nav>
        <Link to="/admin/companies">Компании</Link> |{' '}
        <Link to="/admin/landings">Лендинги</Link>
      </nav>
    </div>
  );
}