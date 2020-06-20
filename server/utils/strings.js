/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
module.exports.generateRandomString = (length) => {
  let text = '';
  let possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

module.exports.stateKey = 'spotify_auth_state';
module.exports.client_id = process.env.SPOTIFY_CLIENT_ID; // Your client id
module.exports.client_secret = process.env.SPOTIFY_CLIENT_SECRETY; // Your secret
module.exports.redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
