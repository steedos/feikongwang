const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        // 根据unionid获取用户userid
        let {accessToken,unionId} = ctx.params;
        let getuserIdApi = "https://oapi.dingtalk.com/topapi/user/getbyunionid?access_token="+accessToken
        let data = {
            "unionid":unionId
          }
        let response = await fetch(getuserIdApi, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        if (response.errcode != 0) {
            throw response.errmsg;
        }
          return response
    }
}