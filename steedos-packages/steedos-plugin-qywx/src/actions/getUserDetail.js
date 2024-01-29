const Qiyeweixin = require("../qywx");
module.exports = {
    handler: async function (ctx) {
        const { accessToken, userTicket } = ctx.params;
        return await Qiyeweixin.getUserDetail(accessToken, userTicket); 
    }
}