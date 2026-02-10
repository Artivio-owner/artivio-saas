import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/auth.store';

export function AuthGuard({ children }: any) {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" />;
  return children;
}