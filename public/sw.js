const cacheName = "himanshu-v12";

self.addEventListener("install", function (e) {
  self.skipWaiting();
});

// Clean up expired caches when service worker is activated
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((res) => {
      // trigger a fetch request to update/create cache
      const actualRespone = fetch(event.request).then((response) => {
        // cache response
        const resClone = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, resClone);
        });
        return response;
      });

      // return cached response or actual response if not cached
      return res ? res : actualRespone;
    })
  );
});
