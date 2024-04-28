module.exports = {
    handler: async function (ctx) {
        const doc = ctx.params.doc;
        console.log("资产领用信息",doc)
        //查询资产领用明细信息
        const objResults = await broker.call('objectql.find', {
            objectName: "asset_recipient_detail",
            query: {
                filters: ["asset_recipient","=",doc._id]
            }
        })
        for(let objResult of objResults){
            console.log("资产领用明细",objResult);
            // 查询资产卡片信息
           const assetsCard = await this.findAssetsCard(objResult.assets_card); 
            let assetsCardDoc = {
                quantity:assetsCard.quantity-objResult.quantity,
                receiving_date:objResult.recipient_date
            }
            console.log("修改资产卡片信息",assetsCardDoc)
            //修改资产卡片信息
            await this.updateAssetsCard(assetsCardDoc,assetsCard._id); 
        }
    }
}