/**
 * ============================================
 * ARTIVIO — LANDING RESOLVER
 * ============================================
 * Определяет ключ лендинга по домену
 */

export function resolveLandingKey(host: string): string {
  const h = host.toLowerCase();

  if (h === 'furnicore.artivio.ru') return 'furnicore';
  if (h === 'furnislicer.artivio.ru') return 'furnislicer';

  // кастомный домен клиента
  return h;
}