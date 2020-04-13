const webpush = require('web-push')
const koaRouter = require('koa-router')
const router = new koaRouter()

const { SUBJECT, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } = require('./config')

webpush.setVapidDetails(SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

function saveRegistrationDetails(endpoint, key, authSecret) {
  // Save the users details in a DB
}

router.post('/sendMessage', async function(ctx, next) {
  var endpoint = ctx.request.body.endpoint
  var authSecret = ctx.request.body.authSecret
  var key = ctx.request.body.key

  const pushSubscription = {
    endpoint: endpoint,
    keys: {
      auth: authSecret,
      p256dh: key
    }
  }

  var body = 'Breaking News: Nose picking ban for Manila police'
  var iconUrl =
    'https://raw.githubusercontent.com/deanhume/progressive-web-apps-book/master/chapter-6/push-notifications/public/images/homescreen.png'

  webpush
    .sendNotification(
      pushSubscription,
      JSON.stringify({
        msg: body,
        url: 'http://localhost:3111/article?id=1',
        icon: iconUrl,
        type: 'actionMessage'
      })
    )
    .then(res => {
      console.log(res)
      ctx.status = 201
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/register', async function(ctx, next) {
  var endpoint = ctx.body.endpoint
  var authSecret = ctx.body.authSecret
  var key = ctx.body.key

  saveRegistrationDetails()

  const pushSubscription = {
    endpoint: endpoint,
    keys: {
      auth: authSecret,
      p256dh: key
    }
  }

  var body = 'Breaking News: Nose picking ban for Manila police'
  var iconUrl =
    'https://raw.githubusercontent.com/deanhume/progressive-web-apps-book/master/chapter-6/push-notifications/public/images/homescreen.png'

  webpush
    .sendNotification(
      pushSubscription,
      JSON.stringify({
        msg: body,
        url: 'https://xiaows127.com/article?id=1',
        icon: iconUrl,
        type: 'actionMessage'
      })
    )
    .then(function(res) {
      console.log(res)
      ctx.status = 201
    })
    .catch(function(err) {
      console.log(err)
    })
})

module.exports = router
