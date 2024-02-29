module.exports = {
    rest: {
        method: "POST",
        fullPath: "/api/qiyeweixin/suite/getResult"
    },
    async handler(ctx) {
        // let query = ctx.params;
        // console.log("====>getResult",query);
        // console.log("result:  ",result);
        // let spaceId = query.spaceId;
        let { space_id } = ctx.params;
        let spaceObj =  this.getObject("spaces");
        let url = "";

        let spaceInfo = await spaceObj.findOne(space_id);

        if (spaceInfo.qywx_contact_id_translate_url){
            url = spaceInfo.qywx_contact_id_translate_url;
            await spaceObj.directUpdate(space_id,{
                qywx_contact_id_translate_url: null
            })
        }
        // 获取企业的jsapi_ticket
        const jsapiTicket = await ctx.broker.call('@steedos/plugin-qywx.getJsapiTicket',{});
       console.log("========>jsapiTicket",jsapiTicket)
        let data = {}
        console.log("====第二个接口",url)
        if(url){
            data = {
                "status": 0,
                "msg": "请下载模版",
                "data": {
                    url:url
                }
              }
        }else{
            data = {
                "status": 0,
                "msg": "",
                "data": {}
              }
        }
        return data;
    }
}