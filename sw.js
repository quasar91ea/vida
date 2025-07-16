// Define a unique cache name for this version of the app
const CACHE_NAME = 'nuevo-quasar-cache-v4'; // Cache version updated

// List all the files and resources that need to be cached for offline use
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/index.css',
  '/manifest.json',
  // Core TSX/TS files
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/services/geminiService.ts',
  // Components
  '/components/ActionPlan.tsx',
  '/components/CalendarView.tsx',
  '/components/Dashboard.tsx',
  '/components/Goals.tsx',
  '/components/InfoView.tsx',
  '/components/PomodoroTimer.tsx',
  '/components/Purpose.tsx',
  '/components/Reflection.tsx',
  '/components/StatisticsView.tsx',
  '/components/common/Chart.tsx',
  '/components/common/ErrorBoundary.tsx',
  '/components/common/Modal.tsx',
  '/components/common/Spinner.tsx',
  '/components/icons/Icon.tsx',
  // Contexts
  '/contexts/NotificationContext.tsx',
  // External resources
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  // Import map dependencies
  'https://esm.sh/react@^19.1.0',
  'https://esm.sh/react-dom@^19.1.0/client',
  'https://esm.sh/chart.js@^4.5.0',
];

// Install event: This is triggered when the service worker is first installed.
self.addEventListener('install', event => {
  // We need to wait until the installation is complete
  event.waitUntil(
    // Open the cache with our specified cache name
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Add all our specified URLs to the cache
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(err => {
        console.error('Failed to cache resources during install:', err);
      })
  );
});

// Fetch event: This is triggered for every network request made by the app.
self.addEventListener('fetch', event => {
  event.respondWith(
    // Check if the requested resource is already in our cache
    caches.match(event.request)
      .then(response => {
        // If a cached response is found, return it.
        if (response) {
          return response;
        }

        // If the resource is not in the cache, try to fetch it from the network.
        return fetch(event.request).then(
          networkResponse => {
            // If the fetch is successful, we should cache the new response for future use.
            // This is a "cache-on-the-fly" strategy.
            // We need to clone the response because it's a stream and can only be consumed once.
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          }
        ).catch(error => {
            // This will happen if the network request fails (e.g., user is offline).
            // Here you could return a custom offline page if you had one.
            console.log('Fetch failed; user is likely offline.', error);
            // Since we didn't find it in the cache and fetching failed, there's nothing more we can do.
        });
      })
  );
});

// Activate event: This is used to clean up old caches.
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // If the cache name is not in our whitelist, delete it.
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});