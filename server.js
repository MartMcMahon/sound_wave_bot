const axios = require("axios");
const querystring = require("querystring");
const tmi = require("tmi.js");

const express = require("express");
const app = express();
const port = 80;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;
console.log("client_id", client_id);

let code = null;
let token = "";
let refresh_token = "";
let token_exp = 0;
const spotify_api = "https://api.spotify.com/v1";

app.get("/", (req, res) => {
  const token_url = "https://accounts.spotify.com/api/token";
  code = req.query.code;

  axios({
    method: "post",
    url: token_url,
    data: querystring.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirect_uri,
    }),
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
      "content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  })
    .then((token_response) => {
      token = token_response.data.access_token;
      token_exp = Date.now() + token_response.expires_in * 1000;
      refresh_token = token_response.data.refresh_token;

      axios({
        method: "get",
        url: "https://api.spotify.com/v1/me",
        headers: {
          Authorization: "Bearer " + token,
        },
      }).then((me_response) => {
        console.log("logged in");
        res.send(me_response.data);

        console.log("token is ", token);
        axios({
          method: "get",
          url: spotify_api + "/me/player",
          headers: {
            Authorization: "Bearer " + token,
          },
        })
          .then((res) => {
            console.log(res);
          })
          .catch((e) => {
            console.log(e);
          });
      });
    })
    .catch((e) => {
      console.log(e);
      res.send(e);
    });
});

app.get("/login", (req, res) => {
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        client_id: client_id,
        response_type: "code",
        redirect_uri: redirect_uri,
        scope: "user-read-playback-state",
      })
  );
});

// Define configuration options
const tmi_opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
};
const client = new tmi.client(tmi_opts);

const onMessageHandler = (target, context, msg, self) => {
  if (self) {
    return;
  } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, execute it
  if (commandName.startsWith("!current")) {
    console.log('current' + res);
    currentlyListening().then((res) => {
      console.log('---------res------------' + res);
      console.log('---------statuscode------------' + res.statusCode);
      console.log('---------data------------' + JSON.parse(res));
      const track = res.data.item.name;
      client.say(target, "currently playing: " + track);
    });
  } else if (commandName === "!d20") {
    const num = rollDice(commandName);
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName.startsWith("!d10")) {
    const num = rollDice(commandName);
    client.say(target, `You rolled a ${num}`);
    // } else if (commandName.startsWith("!help")) {
    //   client.say(target, `!d20    -- for fun`);
    //   client.say(target, `!current -- currently playing`);
    //   client.say(target, `!list    -- current playlist`);
    //   client.say(target, `!play    -- add song to queue`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
};

const currentlyListening = () => {
  return axios({
    method: "get",
    url: spotify_api + "/me/player",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
}

// Function called when the "dice" command is issued
function rollDice(cmd) {
  let sides = 20;
  if (cmd === "!d10") {
    sides = 10;
  }
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);
client.connect();

app.listen(port, () => {
  console.log("listening...");
});
