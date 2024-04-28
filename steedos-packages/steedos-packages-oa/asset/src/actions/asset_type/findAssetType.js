module.exports = {
    handler: async function (ctx) {
        const {typeId} = ctx.params;
        const assetTypeDoc = await this.broker.call('objectql.find', {
            objectName: 'asset_type',
            query: {
                filters: [
                    ['_id', '=', typeId]
                ]
            }
        })
        return assetTypeDoc[0];
    }
}