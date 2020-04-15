const webpush = require('web-push')
const koaRouter = require('koa-router')
const router = new koaRouter({ prefix: '/apis' })

const { User } = require('./mysql')

const { SUBJECT, VAPID_PRIVATE_KEY, VAPID_PUBLIC_KEY } = require('./config')

webpush.setVapidDetails(SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)

const db = []

async function saveRegistrationDetails(endpoint, key, authSecret) {
  // Save the users details in a DB
  try {
    await User.create({
      endpoint: endpoint,
      auth: authSecret,
      p256dh: key
    })
  } catch (e) {
    console.log(e)
  }
}

function push(pushSubscription) {
  const body = '推送消息'
  const iconUrl =
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
    })
    .catch(err => {
      console.log(err)
    })
}

// 需要其他的 toB cms去触发这个 push
router.get('/push', async function(ctx, next) {
  const users = await User.findAll()

  for (let i = 0, il = users.length; i < il; i++) {
    const { endpoint, auth, p256dh } = users[i]

    const pushSubscription = {
      endpoint: endpoint,
      keys: {
        auth: auth,
        p256dh: p256dh
      }
    }

    push(pushSubscription)
  }

  ctx.status = 200
})

router.post('/register', async function(ctx, next) {
  var endpoint = ctx.request.body.endpoint
  var authSecret = ctx.request.body.authSecret
  var key = ctx.request.body.key

  saveRegistrationDetails(endpoint, key, authSecret)

  const pushSubscription = {
    endpoint: endpoint,
    keys: {
      auth: authSecret,
      p256dh: key
    }
  }

  var body = '注册成功'
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
      console.log('注册成功')
    })
    .catch(function(err) {
      console.log(err)
    })

  ctx.status = 201
})

module.exports = router
