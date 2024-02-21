// 获取第三方应用凭证
const qywx_api = require('../router');
const fetch = require('node-fetch');
const Excel = require('exceljs');
const fs = require('fs');
module.exports = {
    handler: async function (ctx) {
        const { provider_access_token, jobid } = ctx.params;
        const qyapi = qywx_api.getResult + "?provider_access_token=" + provider_access_token + "&jobid=" + jobid;
        try {
            let getResultInfo = await fetch(qyapi, {
                method: 'get',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());

            let result = getResultInfo.result;
            console.log("result: ",result);
            let url = result.contact_id_translate.url;
            console.log("url-----: ", url);

            // window.open(url);

            return getResultInfo.result;
        } catch (error) {
            console.log("getResultInfo error: ", error);
        }

    }
}