const {
  stateKey,
  redirect_uri,
  client_id,
  client_secret,
} = require('../utils/strings');
const request = require('request');
const querystring = require('querystring');

module.exports = (app) => {
  app.get('/callback', function (req, res) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
      res.redirect(
        '/#' +
          querystring.stringify({
            error: 'state_mismatch',
          })
      );
    } else {
      res.clearCookie(stateKey);
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

      request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          res.cookie(process.env.ACCESS_TOKEN, body.access_token);
          res.cookie(process.env.REFRESH_TOKEN, body.refresh_token);
          res.redirect('http://localhost:3000');
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
};
