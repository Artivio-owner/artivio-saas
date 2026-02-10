/**
 * ============================================
 * ARTIVIO — ROUTER
 * ============================================
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import WarehousesPage from '../pages/WarehousesPage';
import OrdersPage from '../pages/OrdersPage';
import { useAuth } from '../hooks/useAuth';
import { AdminLayout } from '../layouts/AdminLayout';

import LandingPage from '../landing/LandingPage';

/* … */

<Route path="/" element={<LandingPage />} />

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/warehouses"
          element={
            <PrivateRoute>
              <AdminLayout>
                <WarehousesPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <AdminLayout>
                <OrdersPage />
              </AdminLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}