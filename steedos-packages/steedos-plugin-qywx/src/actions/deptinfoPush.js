const qywxSync = require('../sync');
module.exports = {
    handler: async function (ctx) {
        const { deptId, name, parentId, status = 0 } = ctx.params;
        return await qywxSync.deptinfoPush(deptId, name, parentId, status);
    }
}
