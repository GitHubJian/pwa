const cacheName = 'pwa-demo-v4'
const offlineUrl = 'offline-page.html'

const assetsFiles = [
  '/assets/manifest.json',
  '/index.html',
  '/css/index.css',
  '/js/index.js',
  '/images/helloworld.png',
  '/offline-page.html'
]

self.addEventListener('install', function(event) {
  self.caches.open(cacheName).then(
    function(cache) {
      return cache.addAll(assetsFiles)
    },
    function(err) {
      console.log(err)
    }
  )
})

// 更新缓存
self.addEventListener('activate', function(e) {
  console.log('更新缓存')
  e.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url)

  if (url.pathname.startsWith('/apis')) {
    console.log(event.request.url)
  } else {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        if (response) {
          return response
        }

        var fetchRequest = event.request.clone()

        return fetch(fetchRequest)
          .then(function(response) {
            if (!response || response.status !== 200) {
              return response
            }

            var responseToCache = response.clone()
            caches.open(cacheName).then(function(cache) {
              cache.put(event.request, responseToCache)
            })

            return response
          })
          .catch(function(err) {
            if (
              event.request.method === 'GET' &&
              event.request.headers.get('accept').includes('text/html')
            ) {
              return caches.match(offlineUrl)
            }
          })
      })
    )
  }
})

self.addEventListener('push', function(e) {
  console.log('[Service Worker] Push Received.')
  console.log(`[Service Worker] Push had this data: "${e.data.text()}"`)
  const title = 'Push Codelab'
  const options = {
    body: 'Yay it works.'
  }

  e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(e) {
  e.notification.close()

  e.waitUntil(
    clients.openWindow('https://developers.google.com/web') // eslint-disable-line
  )
})

self.addEventListener('message', function(event) {
  if (event.data === 'skipWaiting') {
    self.skipWaiting()
  }
})
