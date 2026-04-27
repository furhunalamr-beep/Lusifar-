import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './i18n';
import { SystemProvider } from './lib/SystemContext';
import { registerSW } from 'virtual:pwa-register';

// Register the PWA service worker
if ('serviceWorker' in navigator) {
  registerSW({ immediate: true });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SystemProvider>
      <App />
    </SystemProvider>
  </StrictMode>,
);
