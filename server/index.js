const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const request = require('request')
const cors = require('cors')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')

let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
  const nuxt = new Nuxt(config)

  const {
    port = process.env.PORT || 5000,
  } = nuxt.options.server

  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  var client_id = '5a2e5002bd5d42cda6a7b9a49fc309be' // client id
  var client_secret = '130db0a21423462c8a0d205fb9c45193' // secret
  var redirect_uri = 'localhost:5000/callback' // Your redirect uri

  var generateRandomString = function(length) {
    var text = ''
    var possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  var stateKey = 'spotify_auth_state'
  var token = 'access_token'

  app
    .use(cors())
    .use(cookieParser())

  app.get('/auth/login', function(req, res) {
    var state = generateRandomString(16)
    res.cookie(stateKey, state)

    var scope = 'user-read-private user-read-email user-top-read user-follow-read user-read-recently-played'
    res.redirect(
      'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state
        })
    )
  })

  app.get('/auth/callback', function(req, res) {

    var code = req.query.code || null
    var state = req.query.state || null
    var storedState = req.cookies ? req.cookies[stateKey] : null

    if (state === null || state !== storedState) {
      res.redirect(
        '/#' +
          querystring.stringify({
            error: 'state_mismatch'
          })
      )
    } else {
      res.clearCookie(stateKey)
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          Authorization:
            'Basic ' +
            new Buffer(client_id + ':' + client_secret).toString('base64')
        },
        json: true
      }

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token,
            refresh_token = body.refresh_token

          res.redirect(
            '/stats/' +access_token
          )
          // res.cookie('access_token' ,access_token);
          // res.redirect('/')

        } else {
          res.redirect(
            '/' +
              querystring.stringify({
                error: 'invalid_token'
              })
          )
        }
      })
    }
  })

  app.get('/callback', function(req, res) {

    var code = req.query.code || null
    var state = req.query.state || null
    var storedState = req.cookies ? req.cookies[stateKey] : null

    if (state === null || state !== storedState) {
      res.redirect(
        '/#' +
          querystring.stringify({
            error: 'state_mismatch'
          })
      )
    } else {
      res.clearCookie(stateKey)
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          Authorization:
            'Basic ' +
            new Buffer(client_id + ':' + client_secret).toString('base64')
        },
        json: true
      }

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token,
            refresh_token = body.refresh_token

          res.cookie('access_token' ,access_token);
          res.redirect('/')

        } else {
          res.redirect(
            '/' +
              querystring.stringify({
                error: 'invalid_token'
              })
          )
        }
      })
    }
  })


  app.use(nuxt.render)
  app.listen(port)
  consola.ready({
    message: `Server listening ${port}`,
    badge: true
  })
}
start()
