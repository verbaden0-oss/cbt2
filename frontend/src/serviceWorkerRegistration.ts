// Simple service worker registration helper
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;
      navigator.serviceWorker.register(swUrl).then((registration) => {
        console.log('ServiceWorker registered: ', registration.scope);
      }).catch((error) => {
        console.warn('ServiceWorker registration failed: ', error);
      });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const reg of registrations) {
        reg.unregister();
      }
    });
  }
}
