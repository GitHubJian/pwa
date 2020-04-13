;(function($) {
  $('#btn').on('click', function() {
    navigator.serviceWorker.ready.then(function(registration) {
      registration.pushManager.getSubscription().then(function(subscription) {
        var rawKey = subscription.getKey ? subscription.getKey('p256dh') : ''
        key = rawKey
          ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawKey)))
          : ''
        var rawAuthSecret = subscription.getKey
          ? subscription.getKey('auth')
          : ''
        authSecret = rawAuthSecret
          ? btoa(String.fromCharCode.apply(null, new Uint8Array(rawAuthSecret)))
          : ''

        endpoint = subscription.endpoint

        return fetch('https://xiaows127.com/sendMessage', {
          method: 'post',
          headers: new Headers({
            'content-type': 'application/json'
          }),
          body: JSON.stringify({
            endpoint: subscription.endpoint,
            key: key,
            authSecret: authSecret
          })
        })
      })
    })
  })
})(jQuery)
