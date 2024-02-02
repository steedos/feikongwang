// 永久授权码
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
         const {auth_code,suite_access_token } = ctx.params;
         const qyapi = qywx_api.getPermanentCode;
         var data = {
            auth_code: auth_code,
        };
        const getPermanentCodeUrl = qyapi + "?suite_access_token=" + suite_access_token;
          // 获取企业授权信息
          let permanentCodeDoc = await fetch(getPermanentCodeUrl, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        console.log("企业授权信息",permanentCodeDoc);
        if(permanentCodeConfig.errcode!=0){
            throw new Error(permanentCodeConfig.errmsg)
        }
        return permanentCodeDoc
          
    }
}