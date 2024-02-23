module.exports = {
    handler: async function (ctx) {
        return await this.getObject("dingtalk_suite_configurations").findOne(ctx.params._id);
    }
}