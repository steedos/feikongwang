module.exports = {
    handler: async function (ctx) {
        const doc = ctx.params.doc;
        console.log("资产借用明细信息",doc)
        // 查询资产卡片信息
        const assetsCard = await this.findAssetsCard(doc.assets_card);
            if(assetsCard.quantity<doc.quantity){
                throw new Error('借用数量不能大于资产数量');
            }
            if(!doc.quantity || doc.quantity == 0){
                throw new Error('借用数量不能为0');
            }
    }
}