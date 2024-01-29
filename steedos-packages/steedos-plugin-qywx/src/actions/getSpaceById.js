module.exports = {
    handler: async function (ctx) {
        const { spaceId } = ctx.params;
        return await this.getSpaceById(spaceId);
    }
}