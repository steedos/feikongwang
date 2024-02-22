const fetch = require('node-fetch');
module.exports = {
    // 获取企业授权信息
    handler: async function (ctx) {
        let { accessKey,suiteTicket,signature,suite_key,auth_corpid,timestamp } = ctx.params;
        console.log("获取企业授权信息参数",ctx.params)
        let getAuthInfoApi = "https://oapi.dingtalk.com/service/get_auth_info?accessKey="+accessKey+"&timestamp="+timestamp+"&suiteTicket="+suiteTicket+"&signature="+signature
        let data = {
            "suite_key":suite_key,
            "auth_corpid":auth_corpid
          }
        let response = await fetch(getAuthInfoApi, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        console.log("获取企业授权信息",response)
          return response
    }
}