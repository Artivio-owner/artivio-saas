export function getTenant() {
  const host = window.location.hostname;

  if (host.startsWith('furnicore.')) return 'furnicore';
  if (host.startsWith('furnislicer.')) return 'furnislicer';

  return 'client';
}