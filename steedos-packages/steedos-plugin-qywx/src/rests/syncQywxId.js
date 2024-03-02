const Qiyeweixin = require("../qywx");
// const Cookies = require("cookies");
module.exports = {
    rest: {
        method: "GET",
        fullPath: "/api/sync/suite/qywxId",
        authorization: true,
        authentication: true
    },
    async handler(ctx) {
        let query = ctx.params;
        let userInfo = ctx.meta.user;
        let result = "";
        // console.log("====>",query)

        if (userInfo.profile == "admin"){
            let suite_id = process.env.STEEDOS_QYWX_SAAS_SUITEID;
            result = await this.broker.call('@steedos/plugin-qywx.getUserIdByPhone', {
                corpid: query.corpid,
                suite_id: suite_id,
                mobile: query.mobile || "",
            });
        }
        
        // console.log("result:  ",result);
        ctx.meta.$statusCode = 200;
        ctx.meta.$responseType = "text/plain";
        return result;
    }
}