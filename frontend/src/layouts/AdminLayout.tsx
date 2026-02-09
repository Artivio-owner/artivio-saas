/**
 * ============================================
 * ARTIVIO — ADMIN LAYOUT
 * ============================================
 */

import { ReactNode } from 'react';

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{ padding: 16, background: '#111827', color: '#fff' }}>
        Artivio Admin
      </header>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}