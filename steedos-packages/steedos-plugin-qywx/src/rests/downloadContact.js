const fetch = require('node-fetch');
module.exports = {
    rest: {
        method: "POST",
        fullPath: "/api/qiyeweixin/suite/downloadContact"
    },
    async handler(ctx) {
        //第三方服务商回调验证
        let { space_id } = ctx.params;
        console.log("=========>space_id", space_id)
        // let query = ctx.params;
        // console.log("====>",query);
        // console.log("result:  ",result);
        let suite_id = process.env.STEEDOS_QYWX_SAAS_SUITEID;
        let resultInfo = await this.broker.call('@steedos/plugin-qywx.getContact', {
            space_id: space_id,
            suite_id: suite_id
        });
        console.log("=======resultInfo", resultInfo)
        let data = {}
        if(resultInfo && resultInfo.errcode==0){
            data = {
                "status": 0,
                "msg": "正在连接企业微信",
                "data": resultInfo
              }
        }else{
            data = {
                "status": 1,
                "msg": "连接企业微信失败",
                "data": resultInfo
              } 
        }
        return data;
    }
}