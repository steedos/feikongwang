// 获取第三方应用凭证
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const { suite_id, suite_secret, suite_ticket } = ctx.params;
        const qyapi = qywx_api.getSuiteAccessToken;
        var data = {
            suite_id: suite_id,
            suite_secret: suite_secret,
            suite_ticket: suite_ticket
        };
        // 获取第三方凭证信息
        let suite_access_token_info = await fetch(qyapi, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        // console.log("第三方应用凭证", suite_access_token_info)
        return suite_access_token_info

    }
}