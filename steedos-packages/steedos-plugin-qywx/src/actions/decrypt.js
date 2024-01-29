const qywxSync = require('../sync');
module.exports = {
    handler: async function (ctx) {
        return await qywxSync.decrypt(ctx.params);
    }
}