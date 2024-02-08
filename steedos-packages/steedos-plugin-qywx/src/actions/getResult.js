// 获取第三方应用凭证
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const { provider_access_token, jobid } = ctx.params;
        const qyapi = qywx_api.getResult + "?provider_access_token=" + provider_access_token + "&jobid=" + jobid;

        let getResultInfo = await fetch(qyapi, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        return getResultInfo;

    }
}