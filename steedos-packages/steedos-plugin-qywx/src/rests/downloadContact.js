module.exports = {
    rest: {
        method: "POST",
        fullPath: "/api/qiyeweixin/suite/downloadContact"
    },
    async handler(ctx) {
        //第三方服务商回调验证
        let query = ctx.params;
        console.log("====>",query);
        // console.log("result:  ",result);
        let suite_id = process.env.STEEDOS_QYWX_SAAS_SUITEID;
        let resultInfo = await this.broker.call('@steedos/plugin-qywx.getContact', {
            space_id: query.space_id,
            suite_id: suite_id
        });

        return resultInfo;
    }
}