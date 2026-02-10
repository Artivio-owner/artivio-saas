/**
 * ============================================
 * ARTIVIO — PWA INSTALL HOOK
 * ============================================
 */

import { useEffect, useState } from 'react';

export function usePwaInstall() {
  const [prompt, setPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () =>
      window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  function install() {
    if (!prompt) return;
    prompt.prompt();
    setPrompt(null);
  }

  return { canInstall: !!prompt, install };
}