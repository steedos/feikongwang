// 获取第三方应用凭证
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const { auth_corpid, provider_access_token, media_id_list } = ctx.params;
        const qyapi = qywx_api.idTranslate + "?provider_access_token=" + provider_access_token;
        var data = {
            "auth_corpid": auth_corpid,
            "media_id_list": new Array(media_id_list)
        };
        
        let idTranslateInfo = await fetch(qyapi, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        return idTranslateInfo;

    }
}