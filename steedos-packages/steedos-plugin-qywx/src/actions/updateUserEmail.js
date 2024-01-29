const Qiyeweixin = require("../qywx");
module.exports = {
    handler: async function (ctx) {
        const { userId, email } = ctx.params;
        return await Qiyeweixin.updateUserEmail(userId, email);
    }
}