/**
 * ============================================
 * ARTIVIO — PWA INSTALL BUTTON
 * ============================================
 */

import { usePwaInstall } from '../pwa/install.hook';

export function PwaInstallButton() {
  const { canInstall, install } = usePwaInstall();

  if (!canInstall) return null;

  return <button onClick={install}>Установить приложение</button>;
}