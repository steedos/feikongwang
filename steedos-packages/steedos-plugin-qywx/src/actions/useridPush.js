const qywxSync = require('../sync');
module.exports = {
    handler: async function (ctx) {
        const { accessToken, userId, mobile } = ctx.params;
        return await qywxSync.useridPush(accessToken, userId, mobile);
    }
}