const axios = require("axios");

const client_id = process.env.SPOT_ID;
const client_secret = process.env.SPOT_SECRET;

const auth_url = "https://accounts.spotify.com/api/token";
const get_token = async () => {
  const auth_string = `${client_id}:${client_secret}`;
  return axios
    .post(auth_url, "grant_type=client_credentials", {
      headers: {
        Authorization: "Basic " + Buffer.from(auth_string).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => {
      const token = res.data.access_token;
      console.log(token);
      return token;
    })
    .catch((e) => {
      console.log(e);
    });
};

// const token = f();
// console.log(token);
//
get_token.then((token) => {});
