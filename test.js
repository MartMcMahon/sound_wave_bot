const axios = require('axios')

const url = "https://accounts.spotify.com/authorize"
const url2 = "https://accounts.spotify.com/api/token/"
const client_id = "e045f41542f9475e99b142f8359bc368"

// axios.get(url + `/?client_id=${client_id}&response_type=code&redirect_uri=https://mart.pizza`).then(res=>{
//   console.log(res)
//   return res
// })
axios.get(url2 + `authorization_code=AQB7a7as51HoIbHoihcZjlJ1tM9oPB_RbCh2DXl5Qz7xGo8EhgPm1AdFgijQcSGSXTdJjIZOG_wdy - y6 - 3ktBagE0NU535w_GMplZy2ZfLmHp_kG7ZFJucWeiEFpx_0veC27iHLjWqfFAyqLvqawE1x67yfBnw&client_secret=f9a017e91e5741448e310db917580dbf`).then(res=>{
  console.log(res)
  return res
})
