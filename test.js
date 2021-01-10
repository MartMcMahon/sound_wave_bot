const axios = require("axios");

const url = "https://accounts.spotify.com/authorize";
const client_id = process.env.SPOT_ID;
const client_secret = process.env.SPOT_SECRET;

const first = () => {
  axios
    .get(
      url +
        `/?client_id=${client_id}&response_type=code&redirect_uri=https://soundwavebot.netlify.app/`
    )
    .then((res) => {
      console.log(res);
      return res;
    });
};

const second = () => {
  axios.post()
}
