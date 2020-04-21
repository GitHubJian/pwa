// 初始化数据库
;(function() {
  var db
  function createInstance() {
    if (!db) {
      db = new Promise(function(resolve, reject) {
        var req = indexedDB.open('keyval-store', 1)
        req.onerror = function() {
          reject(req.error)
        }
        req.onupgradeneeded = function() {
          req.result.createObjectStore('keyval')
        }
        req.onsuccess = function() {
          resolve(req.result)
        }
      })
    }

    return db
  }

  function withStore(type, callback) {
    return createInstance().then(function(db) {
      return new Promise(function(resolve, reject) {
        var transaction = db.transaction('keyval', type)
        callback(transaction.objectStore('keyval'))

        transaction.oncomplete = function() {
          resolve()
        }
        transaction.onerror = function() {
          reject(transaction.error)
        }
      })
    })
  }

  var idbKeyval = {
    get: function(key) {
      var req
      return withStore('readonly', function(store) {
        req = store.get(key)
      }).then(function() {
        return req.result
      })
    },
    set: function(key, value) {
      return withStore('readwrite', function(store) {
        store.put(value, key)
      })
    },
    delete: function(key) {
      return withStore('readwrite', function(store) {
        store.delete(key)
      })
    },
    keys: function() {
      var keys = []
      return withStore('readonly', function(store) {
        ;(store.openKeyCursor || store.openCursor).call(
          store
        ).onsuccess = function() {
          if (!this.result) return
          keys.push(this.result.key)
          this.result.continue()
        }
      }).then(function() {
        return keys
      })
    }
  }

  self.idbKeyval = idbKeyval
})()

// storage
;(function() {
  var storage = {}

  storage.get = function(key, callback) {
    self.onmessage = callback

    self.postMessage(
      JSON.stringify({
        key: 'storage.getItem',
        params: [key]
      })
    )
  }

  storage.set = function(key, value) {
    if (key) {
      try {
        window.localStorage.setItem(key, value)
        return true
      } catch (e) {
        // ignore
      }
    }

    return false
  }

  self.storage = storage
})()

const cacheName = 'pwa-demo-v4'
const offlineUrl = 'offline-page.html'

const assetsFiles = [
  '/assets/manifest.json',
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
  e.waitUntil(self.clients.claim())
})

function streamJson(json) {
  const stream = new ReadableStream({
    start: controller => {
      const encoder = new TextEncoder()
      let pos = 0
      let chunkSize = 1

      function push() {
        if (pos >= json.length) {
          controller.close()
          return
        }

        controller.enqueue(encoder.encode(json.slice(pos, pos + chunkSize)))

        pos += chunkSize
        setTimeout(push, 50)
      }

      push()
    }
  })

  const res = new Response(stream, {
    headers: {
      'Context-Type': 'application/json'
    }
  })

  return res
}

self.addEventListener('fetch', function(event) {
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

function streamArticle(url) {
  try {
    new ReadableStream({})
  } catch (error) {
    return new Response('Streams not supported')
  }

  const stream = new ReadableStream({
    start(controller) {
      const startFetch = caches.match('./header.html')
      const bodyData = fetch(`./data/${url}.html`).catch(
        () => new Response('Body fetch failed')
      )
      const endFetch = caches.match('./footer.html')

      function pushStream(stream) {
        const reader = stream.getReader()
        function read() {
          return reader.read().then(result => {
            if (result.done) return
            controller.enqueue(result.value)
            return read()
          })
        }
        return read()
      }

      startFetch
        .then(response => pushStream(response.body))
        .then(() => bodyData)
        .then(response => pushStream(response.body))
        .then(() => endFetch)
        .then(response => pushStream(response.body))
        .then(() => controller.close())
    }
  })

  return new Response(stream, {
    headers: {
      'Context-Type': 'text/html'
    }
  })
}

function getQueryString(field, url = window.location.href) {
  var reg = new RegExp('[?&]' + field + '=([^&#]*)', 'i')
  var string = reg.exec(url)
  return string ? string[1] : null
}
