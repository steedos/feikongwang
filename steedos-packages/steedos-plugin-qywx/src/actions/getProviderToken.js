const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const { corpid, provider_secret } = ctx.params;
        var data, qyapi, response;
        try {
            qyapi = qywx_api.getProviderToken;
            if (!qyapi)
                return;

            data = {
                "corpid": corpid,
                "provider_secret": provider_secret
            };
            response = await fetch(qyapi, {
                method: 'post',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());
            
            return response;
        } catch (err) {
            console.error(err);
        }
    }
}