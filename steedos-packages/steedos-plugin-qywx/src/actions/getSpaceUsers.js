const Qiyeweixin = require("../qywx");
module.exports = {
    handler: async function (ctx) {
        const { spaceId } = ctx.params;
        return await Qiyeweixin.getSpaceUsers(spaceId); 
    }
}