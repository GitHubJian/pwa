let cacheName = 'pwa-demo-v5'

let assetsFiles = ['/', '/index.html', '/css/main.css', '/manifest.json']

self.addEventListener('install', function(e) {
  self.caches.open(cacheName).then(function(cache) {
    console.log('sw install')
    return cache.addAll(assetsFiles)
  })
})

// 更新缓存
self.addEventListener('activate', function(e) {
  e.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', e => {
  console.log(e.request.url)

  if (
    /\.jpg$|.png$|.js$|.map$/.test(e.request.url) &&
    e.request.url.indexOf('hot-update.js') === -1
  ) {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        let requestToCache = e.request.clone()
        if (response) {
          fetch(requestToCache).then(res => {
            if (res && res.status === 200) {
              caches.open(cacheName).then(function(cache) {
                cache.delete(requestToCache)
                cache.put(requestToCache, res.clone())
              })
            }
          })

          return response
        }

        return fetch(requestToCache).then(res => {
          if (!res || res.status !== 200) {
            return res
          }
          var responseToCache = res.clone()
          caches.open(cacheName).then(function(cache) {
            cache.put(requestToCache, responseToCache)
          })

          return res
        })
      })
    )
  } else {
    console.log(e.request.url)

    return fetch(e.request)
  }
})

self.addEventListener('push', function(e) {
  console.log('[Service Worker] Push Received.')
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`)
  const title = 'Push Codelab'
  const options = {
    body: 'Yay it works.'
  }

  e.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', function(e) {
  event.notification.close()

  event.waitUntil(
    clients.openWindow('https://developers.google.com/web/') // eslint-disable-line
  )
})
