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

import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard } from './guards';

import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/cabinet/DashboardPage';
import ProductsPage from '../pages/cabinet/ProductsPage';
import OrdersPage from '../pages/cabinet/OrdersPage';

import FurniCoreLanding from '../landings/FurniCoreLanding';
import FurniSlicerLanding from '../landings/FurniSlicerLanding';
import { getTenant } from '../utils/tenant.util';

const tenant = getTenant();

if (tenant === 'furnicore') {
  routes.unshift({ path: '/', element: <FurniCoreLanding /> });
}

if (tenant === 'furnislicer') {
  routes.unshift({ path: '/', element: <FurniSlicerLanding /> });
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: (
      <AuthGuard>
        <DashboardPage />
      </AuthGuard>
    ),
  },
  {
    path: '/products',
    element: (
      <AuthGuard>
        <ProductsPage />
      </AuthGuard>
    ),
  },
  {
    path: '/orders',
    element: (
      <AuthGuard>
        <OrdersPage />
      </AuthGuard>
    ),
  },
]);

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