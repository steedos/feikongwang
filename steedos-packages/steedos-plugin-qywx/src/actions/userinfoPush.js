const qywxSync = require('../sync');
module.exports = {
    handler: async function (ctx) {
        const { userId, status = 0 } = ctx.params;
        return await qywxSync.userinfoPush(userId, status);
    }
}