const qywxSync = require('../sync');
module.exports = {
    handler: async function (ctx) {
        const { content } = ctx.params;
         return qywxSync.write(content);
    }
}