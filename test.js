const axios = require('axios')

const url = "https://accounts.spotify.com/authorize"
const client_id = "e045f41542f9475e99b142f8359bc368"

axios.get(url + `/?client_id=${client_id}&response_type=code&redirect_uri=https://mart.pizza`).then(res=>{
  console.log(res)
  return res
})
