const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        // 获取获取用户token
        let {clientId,clientSecret,code,grantType} = ctx.params;
        let getuserTokenApi = "https://api.dingtalk.com/v1.0/oauth2/userAccessToken"
        let data = {
            "clientId":clientId,
            "clientSecret":clientSecret,
            "code":code,
            // "refreshToken":refreshToken,
             "grantType":grantType
          }
        let response = await fetch(getuserTokenApi, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        console.log("======>获取获取用户token",response);
          return response
    }
}