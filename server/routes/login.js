const {
  generateRandomString,
  stateKey,
  client_id,
  redirect_uri,
} = require('../utils/strings');
const querystring = require('querystring');

module.exports = function (app) {
  app.get('/login', function (req, res) {
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
};
