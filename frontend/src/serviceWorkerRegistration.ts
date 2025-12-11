// Service worker registration with auto-update support
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;

      navigator.serviceWorker.register(swUrl).then((registration) => {
        console.log('ServiceWorker registered: ', registration.scope);

        // Check for updates immediately
        registration.update();

        // Check for updates every 60 seconds
        setInterval(() => {
          registration.update();
        }, 60000);

        // Handle updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New content available - show update prompt
                console.log('New content available! Refreshing...');

                // Show update notification
                if (window.confirm('Доступна новая версия приложения! Обновить?')) {
                  // Skip waiting and reload
                  installingWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              } else {
                // Content cached for offline use
                console.log('Content is cached for offline use.');
              }
            }
          };
        };
      }).catch((error) => {
        console.warn('ServiceWorker registration failed: ', error);
      });
    });

    // Handle controller change (when new SW takes over)
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
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
