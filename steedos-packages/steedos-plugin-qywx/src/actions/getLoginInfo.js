const Qiyeweixin = require("../qywx");
module.exports = {
    handler: async function (ctx) {
        const { accessToken, authCode } = ctx.params;
        return await Qiyeweixin.getLoginInfo(accessToken, authCode);
    }
}