/**
 * ============================================
 * ARTIVIO — SUPER ADMIN ROUTER
 * ============================================
 */

import { Routes, Route } from 'react-router-dom';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CompaniesPage from './pages/CompaniesPage';
import DomainsPage from './pages/DomainsPage';
import PlansPage from './pages/PlansPage';
import LandingsPage from './pages/LandingsPage';

export function AdminRouter() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboardPage />} />
      <Route path="/companies" element={<CompaniesPage />} />
      <Route path="/domains" element={<DomainsPage />} />
      <Route path="/plans" element={<PlansPage />} />
      <Route path="/landings" element={<LandingsPage />} />
    </Routes>
  );
}