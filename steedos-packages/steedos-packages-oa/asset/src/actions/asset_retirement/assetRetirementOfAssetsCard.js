module.exports = {
    handler: async function (ctx) {
        const doc = ctx.params.doc;
        console.log("资产归还信息",doc)
        //查询资产报废明细信息
        const objResults = await broker.call('objectql.find', {
            objectName: "asset_retirement_detail",
            query: {
                filters: ["asset_retirement","=",doc._id]
            }
        })
        for(let objResult of objResults){
            console.log("资产报废明细",objResult);
            // 查询资产卡片信息
           const assetsCard = await this.findAssetsCard(objResult.assets_card); 
            let assetsCardDoc = {
                status:"报废",
                is_active:false
            }
            console.log("修改资产卡片信息",assetsCardDoc)
            //修改资产卡片信息
            await this.updateAssetsCard(assetsCardDoc,assetsCard._id); 
        }
    }
}