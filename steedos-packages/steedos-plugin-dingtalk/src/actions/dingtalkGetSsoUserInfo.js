const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        let {access_token,code} = ctx.params;
        let getuserinfoApi = "https://api.dingtalk.com/v1.0/oauth2/ssoUserInfo?code="+code
        let data = {
            "code":code
          }
        let userInfo = await fetch(getuserinfoApi, {
            method: 'get',
            headers: {
                "x-acs-dingtalk-access-token":access_token,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
          console.log("======>userInfo",userInfo);
          return userInfo
    }
}