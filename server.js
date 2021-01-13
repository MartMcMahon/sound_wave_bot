const axios = require("axios");
const querystring = require("querystring");
const tmi = require("tmi.js");

const express = require("express");
const app = express();
const port = 80;

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

let code = null;
let token = "";
let refresh_token = "";
let token_exp = 0;

app.get("/", (req, res) => {
  const token_url = "https://accounts.spotify.com/api/token";
  code = req.query.code;

  console.log("code is ", code);
  console.log(
    "auth is ",
    Buffer.from(`${client_id}:${client_secret}`).toString("base64")
  );
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
        console.log(me_response);
        res.send(me_response.data);
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
      })
  );
});

const client = new tmi.client(tmi_opts);
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

const onMessageHandler = (target, context, msg, self) => {
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
};

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 20;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

client.connect();

// app.listen(port, () => {
//   console.log("listening...");
// });
