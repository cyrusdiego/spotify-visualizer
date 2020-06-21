const request = require('request');

module.exports = (app) => {
  app.get('/refresh', (req, res, next) => {
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
          new Buffer(
            process.env.SPOTIFY_CLIENT_ID +
              ':' +
              process.env.SPOTIFY_CLIENT_SECRETY
          ).toString('base64'),
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
};
