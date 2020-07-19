const functions = require('firebase-functions');
const querystring = require('querystring');
const request = require('request');
const {
  generateRandomString,
  stateKey,
  client_id,
  redirect_uri,
  client_secret,
} = require('./utils/strings');

exports.login = functions.https.onRequest((req, res) => {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope =
    'user-read-private user-read-email user-read-playback-state user-modify-playback-state';

  res.redirect(
    'https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

exports.callback = functions.https.onRequest((req, res) => {
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      '/#' +
        querystring.stringify({
          error: 'state_null',
        })
    );
  } else {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',
      },
      headers: {
        Authorization:
          'Basic ' +
          new Buffer(client_id + ':' + client_secret).toString('base64'),
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        res.cookie('access_token', body.access_token);
        res.cookie('refresh_token', body.refresh_token);
        res.redirect('https://spotify-visualizer-14c21.web.app/visualizer');
      } else {
        res.redirect(
          '/#' +
            querystring.stringify({
              error: 'invalid_token',
            })
        );
      }
    });
  }
});

exports.refresh = functions.https.onRequest((req, res) => {
  const refresh_token = req.query.token;
  if (!refresh_token) {
    res.status(400);
    res.send({ ERROR: 'No token provided.' });
    return;
  }

  const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64'),
    },
    form: {
      refresh_token,
      grant_type: 'refresh_token',
    },
    json: true,
  };

  request.post(authOptions, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const access_token = body.access_token;
      res.send({ access_token });
    } else {
      res.status(401);
      res.send();
    }
  });
});
