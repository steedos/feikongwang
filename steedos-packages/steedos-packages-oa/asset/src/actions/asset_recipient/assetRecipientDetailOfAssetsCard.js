module.exports = {
    handler: async function (ctx) {
        const doc = ctx.params.doc;
        console.log("资产领用明细信息",doc)
            if(doc.asset_quantity<doc.quantity){
                throw new Error('领用数量不能大于资产数量');
            }
            if(doc.quantity == 0){
                throw new Error('领用数量不能为0');
            }
    }
}