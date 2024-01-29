const Qiyeweixin = require("../qywx");
module.exports = {
    handler: async function (ctx) {
        const { corpId } = ctx.params;
        return await Qiyeweixin.getSpace(corpId); 
    }
}