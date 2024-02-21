const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        let {access_token,code} = ctx.params;
        let getuserinfoApi = "https://oapi.dingtalk.com/topapi/v2/user/getuserinfo?access_token="+access_token
        let data = {
            "code":code
          }
        let userInfo = await fetch(getuserinfoApi, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
          console.log("======>userInfo",userInfo);
          return userInfo
    }
}