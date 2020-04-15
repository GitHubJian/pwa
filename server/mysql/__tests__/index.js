const { User } = require('../model')
//
;(async function() {
  const users = await User.create({
    endpoint: '123',
    auth: '123',
    p256dh: '213'
  })
  console.log(users)
})()
