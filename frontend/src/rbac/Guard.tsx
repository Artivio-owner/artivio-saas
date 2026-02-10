/**
 * ============================================
 * ARTIVIO — RBAC GUARD
 * ============================================
 */

import { ReactNode } from 'react';
import { CompanyRole } from './roles';
import { usePermission } from './usePermission';

export function Guard({
  allow,
  children,
}: {
  allow: CompanyRole[];
  children: ReactNode;
}) {
  const permitted = usePermission(allow);

  if (!permitted) return null;

  return <>{children}</>;
}