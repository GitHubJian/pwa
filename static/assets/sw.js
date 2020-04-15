let cacheName = 'pwa-demo-v2'

let assetsFiles = [
  '/manifest.json',
  '/index.html',
  '/css/index.css',
  '/js/index.js',
  '/images/helloworld.png'
]

self.addEventListener('install', function(event) {
  self.caches.open(cacheName).then(
    function(cache) {
      console.log('sw install')

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

self.addEventListener('fetch', function(e) {
  console.log('请求 URI: ')
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
