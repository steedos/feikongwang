const Qiyeweixin = require("../qywx");
module.exports = {
    rest: {
        method: "GET",
        fullPath: "/api/qiyeweixin/callback",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
        //第三方服务商回调验证
        var query = ctx.params;
        console.log("====>",query)
        var newCrypt = await Qiyeweixin.newCrypt();
        var result = newCrypt.decrypt(query["echostr"]);
        // console.log("result:  ",result);
        ctx.meta.$statusCode = 200;
        ctx.meta.$responseType = "text/plain";
        return result.message;
    }
}