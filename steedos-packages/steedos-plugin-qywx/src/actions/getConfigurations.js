module.exports = {
    handler: async function (ctx) {
        return await this.getObject("qywx_suite_configurations").findOne(ctx.params._id);
    }
}