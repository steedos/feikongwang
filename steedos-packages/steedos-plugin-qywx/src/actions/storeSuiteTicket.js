const Qiyeweixin = require("../qywx");
module.exports = {
    handler: async function (ctx) {
        const { suite_id, suite_secret, message } = ctx.params;
        // 第三方suite_ticket推送
        if (!message.SuiteTicket)
            return;
        
        var r = await await ctx.broker.call('@steedos/plugin-qywx.getSuiteAccessToken', {
            "suite_id": suite_id,
            "suite_secret": suite_secret,
            "suite_ticket": message.SuiteTicket
        });

        if (r && (r != null ? r.suite_access_token : void 0)) {
            var conf = await this.getObject('qywx_suite_configurations').findOne(suite_id);
            if (conf){
                await this.getObject('qywx_suite_configurations').update(suite_id,
                    {
                        "suite_ticket": message.SuiteTicket,
                        "suite_access_token": r.suite_access_token
                    },
                  );
            }else{
                await this.getObject('qywx_suite_configurations').insert(
                    {
                        "_id": suite_id,
                        "suite_ticket": message.SuiteTicket,
                        "suite_access_token": r.suite_access_token
                    },
                  );
            }
            
            // console.log("r.suite_access_token: ",r.suite_access_token)
        }
    }
}