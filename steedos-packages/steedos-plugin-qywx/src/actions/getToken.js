const Qiyeweixin = require("../qywx");
module.exports = {
    handler: async function (ctx) {
        const { corpId, secret } = ctx.params;
        return await Qiyeweixin.getToken(corpId, secret); 
    }
}