// 获取访问用户敏感信息
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const { suite_access_token, user_ticket } = ctx.params;
        const qyapi = qywx_api.getuserdetail3rd;
        const getUserInfo3rdUrl = qyapi + "?suite_access_token=" + suite_access_token;
        // 获取信息
        let data = {
            "user_ticket": user_ticket
        }
        let response = await fetch(getUserInfo3rdUrl, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        // console.log("====访问用户敏感信息", response)
        return response

    }
}