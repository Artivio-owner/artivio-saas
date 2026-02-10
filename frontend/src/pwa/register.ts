/**
 * ============================================
 * ARTIVIO — PWA REGISTER
 * ============================================
 */

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // silent fail
      });
    });
  }
}