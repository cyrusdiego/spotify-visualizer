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
module.exports.client_id = '64f6322c7654482384c5d0b9798d0973'; // Your client id
module.exports.client_secret = 'eb53c9dfe6074fdd932072a811e8c8e6'; // Your secret
module.exports.redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
