/**
 * ============================================
 * ARTIVIO — SUPER ADMIN LAYOUT
 * ============================================
 */

import { ReactNode } from 'react';

export function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
      <header style={{ padding: 16 }}>Artivio Super Admin</header>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}