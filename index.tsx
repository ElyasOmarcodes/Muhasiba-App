
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    const swSource = `
        const CACHE = 'mohasiba-v6';
        self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(['/']))));
        self.addEventListener('fetch', e => e.respondWith(caches.match(e.request).then(r => r || fetch(e.request))));
    `;
    const swUrl = 'data:application/javascript;base64,' + btoa(swSource);
    navigator.serviceWorker.register(swUrl).catch(() => {});
}
