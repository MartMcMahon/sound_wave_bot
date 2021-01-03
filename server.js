const tmi = require("tmi.js");

// Define configuration options
const tmi_opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
};

// Create a client with our options
const client = new tmi.client(tmi_opts);

// Register our event handlers (defined below)
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === "!d20") {
    const num = rollDice(commandName);
    client.say(
      target,
      `You rolled a ${num}. Link: https://glitch.com/~twitch-chatbot`
    );
    console.log(`* Executed ${commandName} command`);
  } else if (commandName.startsWith("!add")) {
    const args = commandName.split(" ");
    console.log(`what you typed was ${args[1]}`);
    const res = getAlbum(args[1]);
    client.say(target, `here's an album you didn't request: ${args[1]}`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

const SpotifyWebApi = require("spotify-web-api-node");

// credentials are optional
let spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOT_ID,
  clientSecret: process.env.SPOT_SECRET,
  redirectUri: "https://www.mart.pizza",
});

const getAlbum = (album_id) => {
  // Get album
  return spotifyApi.getAlbum("5U4W9E5WsYb2jUQWePT8Xm").then(
    function(data) {
      console.log("Album information", data.body);
      return data.body;
    },
    function(err) {
      console.error(err);
    }
  );
};

// authenticate w/ spotify
// listen on twitrch

// cmd, (song = input_str.split(" "));
// if (cmd == "!add") {
//   // add {song} to spotify queue
// }
