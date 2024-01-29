module.exports = {
    handler: async function (ctx) {
        const { corpId } = ctx.params;
        return await this.getSpaceByDingtalk(corpId);
    }
}