const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        let {suiteKey,suiteSecret,authCorpId,suiteTicket} = ctx.params;
        let getAccessApi = "https://api.dingtalk.com/v1.0/oauth2/corpAccessToken"
        let data = {
            "suiteKey" : suiteKey,
            "suiteSecret" : suiteSecret,
            "authCorpId" : authCorpId,
            "suiteTicket" : suiteTicket
          }
        let accessToken = await fetch(getAccessApi, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
          console.log("======>accessToken",accessToken);
          return accessToken
    }
}