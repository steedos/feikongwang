const Qiyeweixin = require("../qywx");
module.exports = {
    handler: async function (ctx) {
        const { accessToken, code } = ctx.params;
        return await Qiyeweixin.getUserInfo(accessToken, code); 
    }
}