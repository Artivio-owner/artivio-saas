/**
 * ============================================
 * ARTIVIO — ENTRY
 * ============================================
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './app/router';
import { registerServiceWorker } from './pwa/register';
import { registerServiceWorker } from './pwa/registerSW';

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);


import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
);

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { registerPWA } from './app/pwa';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

registerPWA();

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { registerPWA } from './app/pwa';
import './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

registerPWA();