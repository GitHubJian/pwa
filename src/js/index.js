require('../css/index.css')

//
;(function($) {
  $('#btn').on('click', function(e) {
    return fetch('https://xiaows127.com/apis/list', {
      method: 'get',
      headers: new Headers({
        'content-type': 'application/json'
      }),
      mode: 'cors'
    })
      .then(function(response) {
        return response.json()
      })
      .then(function(res) {
        console.log(res)
      })
      .catch(function(err) {
        console.log(err)
      })
  })

  $('#btn2').on('click', function() {
    return fetch('/apis/userinfo', {
      method: 'get',
      headers: new Headers({
        'content-type': 'application/json'
      })
    })
      .then(function(response) {
        return response.json()
      })
      .then(function(res) {
        console.log(res)
      })
      .catch(function(err) {
        console.log(err)
      })
  })
})(jQuery)
