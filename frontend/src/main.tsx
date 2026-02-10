/**
 * ============================================
 * ARTIVIO — ENTRY
 * ============================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './app/router';
import { registerServiceWorker } from './pwa/register';

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);