function jsonStream(json) {
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

  return new Response(stream, {
    headers: {
      'Context-Type': 'application/json'
    }
  })
}

var a = jsonStream(JSON.stringify({ a: 1 }))
console.log(a)
