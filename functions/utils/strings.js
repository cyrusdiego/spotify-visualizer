const functions = require('firebase-functions');

module.exports.generateRandomString = (length) => {
  let text = '';
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

module.exports.stateKey = '__session';
module.exports.client_id = functions.config().spotify_client.id; // Your client id
module.exports.client_secret = functions.config().spotify_client.secret; // Your secret
module.exports.redirect_uri =
  'https://spotify-visualizer-14c21.web.app/callback'; // Your redirect uri
