import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const swUrl = `${import.meta.env.BASE_URL}sw.js`;

// Register Service Worker for true offline PWA functionality
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl)
      .then((reg) => {
        console.log('[SW] Registered successfully with scope:', reg.scope);
      })
      .catch((err) => {
        console.error('[SW] Registration failed:', err);
      });
  });
} else if ('serviceWorker' in navigator) {
  // Also register in dev mode if supported
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(swUrl).catch(() => {});
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
