const webpush = require('web-push')

const vapidKeys = webpush.generateVAPIDKeys()

const publicKey = vapidKeys.publicKey
const privateKey = vapidKeys.privateKey

console.log(publicKey)
console.log(privateKey)
