const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        // 查询用户详情
        let {access_token,userid} = ctx.params;
        let getuserinfoApi = "https://oapi.dingtalk.com/topapi/v2/user/get?access_token="+access_token
        let data = {
            "userid":userid
          }
        let response = await fetch(getuserinfoApi, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        if (response.errcode != 0) {
            throw response.errmsg;
        }
          return response.result
    }
}