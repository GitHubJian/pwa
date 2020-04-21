var endpoint
var key
var authSecret
// We need to convert the VAPID key to a base64 string when we subscribe
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

function determineAppServerKey() {
  var vapidPublicKey = window.vapid

  return urlBase64ToUint8Array(vapidPublicKey)
}

window.addEventListener('sw.update', function() {
  if (window.confirm('Do you want to update sw.js?')) {
    try {
      navigator.serviceWorker.getRegistration().then(registration => {
        registration.waiting.postMessage('skipWaiting')
      })
    } catch (e) {
      window.location.reload()
    }
  }
})

function receiver(event) {
  var origin = event.origin || event.originalEvent.origin

  if (origin !== 'https://xiaows127.com') {
    return
  }

  var data = event.data

  console.log(data)
}

window.addEventListener('message', receiver, false)

navigator.serviceWorker.addEventListener('controllerchange', function() {
  window.location.reload()
})

function emitUpdate() {
  var event = document.createEvent('Event')
  event.initEvent('sw.update', true, true)
  window.dispatchEvent(event)
}

// index
function main() {
  if ('serviceWorker' in window.navigator && 'PushManager' in window) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function(registration) {
        if (registration.waiting) {
          emitUpdate()

          return
        }

        registration.addEventListener('updatefound', function() {
          var installingWorker = registration.installing
          installingWorker.addEventListener('statechange', function() {
            switch (installingWorker.state) {
              case 'installed':
                if (navigator.serviceWorker.controller) {
                  emitUpdate()
                }
                break
            }
          })
        })

        return registration.pushManager
          .getSubscription()
          .then(function(subscription) {
            if (subscription) {
              // We already have a subscription, let's not add them again
              return
            }

            return registration.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: determineAppServerKey()
              })
              .then(function(subscription) {
                var rawKey = subscription.getKey
                  ? subscription.getKey('p256dh')
                  : ''
                key = rawKey
                  ? btoa(
                      String.fromCharCode.apply(null, new Uint8Array(rawKey))
                    )
                  : ''

                var rawAuthSecret = subscription.getKey
                  ? subscription.getKey('auth')
                  : ''
                authSecret = rawAuthSecret
                  ? btoa(
                      String.fromCharCode.apply(
                        null,
                        new Uint8Array(rawAuthSecret)
                      )
                    )
                  : ''

                endpoint = subscription.endpoint

                return fetch('https://xiaows127.com/apis/register', {
                  method: 'post',
                  headers: new Headers({
                    'content-type': 'application/json'
                  }),
                  body: JSON.stringify({
                    endpoint: endpoint,
                    key: key,
                    authSecret: authSecret
                  })
                }).then(
                  function(res) {
                    console.log('注册成功')
                  },
                  function(err) {
                    console.error('注册失败')
                  }
                )
              })
          })
      })
      .catch(function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err)
      })
  }
}

main()
