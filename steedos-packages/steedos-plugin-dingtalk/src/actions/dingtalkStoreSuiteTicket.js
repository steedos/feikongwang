
module.exports = {
    handler: async function (ctx) {
        const { suiteTicket,agent_id } = ctx.params;
        let suiteKey = process.env.STEEDOS_DD_SAAS_SUITEKEY;
        let suiteSecret = process.env.STEEDOS_DD_SAAS_SUITESECRET;
        let corpId = process.env.STEEDOD_DD_SAAS_CORPID
        let accessTokenInfo = await broker.call('@steedos/plugin-dingtalk.dingtalkGetAccessToken', {
            "suiteKey": suiteKey,
            "suiteSecret": suiteSecret,
            "authCorpId": corpId,
            "suiteTicket": suiteTicket
        });
        console.log("存储accessToken与suiteTicket",accessTokenInfo);
        if(accessTokenInfo.accessToken){
            var conf = await this.getObject('dingtalk_suite_configurations').findOne(corpId);
            if(conf){
                await this.getObject('dingtalk_suite_configurations').update(corpId,
                    {
                        "suite_ticket": suiteTicket,
                        "suite_access_token": accessTokenInfo.accessToken,
                        "agent_id":agent_id
                    },
                );
            }else{
                await this.getObject('dingtalk_suite_configurations').insert(
                    {
                        "_id": corpId,
                        "suite_ticket": suiteTicket,
                        "suite_access_token":  accessTokenInfo.accessToken
                    },
                );
            }
        }else{
            throw "获取第三方应用授权企业的accessToken,失败";
        }
    }
}