const Qiyeweixin = require("../qywx");
module.exports = {
    handler: async function (ctx) {
        const { spaceId, userInfo } = ctx.params;
        return await Qiyeweixin.getSpaceUser(spaceId, userInfo); 
    }
}