const Qiyeweixin = require("../qywx");
module.exports = {
    handler: async function (ctx) {
        const { userId, mobile } = ctx.params;
        return await Qiyeweixin.updateUserMobile(userId, mobile);
    }
}