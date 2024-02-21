module.exports = {
    rest: {
        method: "POST",
        fullPath: "/api/qiyeweixin/suite/getResult"
    },
    async handler(ctx) {
        let query = ctx.params;
        // console.log("====>getResult",query);
        // console.log("result:  ",result);
        let spaceId = query.spaceId;
        let spaceObj =  this.getObject("spaces");
        let url = "";

        let spaceInfo = await spaceObj.findOne(spaceId);

        if (spaceInfo.qywx_contact_id_translate_url){
            url = spaceInfo.qywx_contact_id_translate_url;
            await spaceObj.directUpdate(spaceId,{
                qywx_contact_id_translate_url: null
            })
        }

        return url;
    }
}