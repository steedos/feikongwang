const Qiyeweixin = require("../qywx");
module.exports = {
    handler: async function (ctx) {
        const { corpId, providerSecret } = ctx.params;
        return await Qiyeweixin.getProviderToken(corpId, providerSecret); 
    }
}