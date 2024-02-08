// 获取第三方应用凭证
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const suiteConfObj = this.getObject("qywx_suite_configurations");
        let { suite_id, auth_corpid, permanent_code } = ctx.params;
        // 获取费控王应用配置
        let fkwConfig = await suiteConfObj.findOne(suite_id);
        let { suite_access_token } = fkwConfig;

        let data = {
            auth_corpid: auth_corpid,
            permanent_code: permanent_code
        };

        let qyapi = qywx_api.getCorpToken + "?suite_access_token=" + suite_access_token;
        console.log("qyapi: ",qyapi);
        // 获取第三方凭证信息
        let access_token_info = await fetch(qyapi, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        console.log("第三方AccessToken", access_token_info)
        return access_token_info;
    }
}