//修改资产卡片
module.exports = {
    handler: async function (doc,id) {
         console.log("资产卡片id",id)
         const result = await this.broker.call('objectql.update', {
            objectName: 'assets_card',
            id,
            doc
        })
         
    }
}