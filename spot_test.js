const SpotifyWebApi = require('spotify-web-api-node');

// credentials are optional
let spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOT_ID,
  clientSecret: process.env.SPOT_SECRET,
  redirectUri: 'http://www.mart.pizza/'
});

// Get album
spotifyApi.getAlbum('5U4W9E5WsYb2jUQWePT8Xm')
  .then(function(data) {
    console.log('Album information', data.body);
  }, function(err) {
    console.error(err);
  });

// authenticate w/ spotify
// listen on twitrch

cmd, song = input_str.split(" ")
if (cmd == "!add") {
  // add {song} to spotify queue
}
