module.exports = {
    handler: async function (ctx) {
        const doc = ctx.params.doc;
        console.log("资产归还信息",doc)
        //查询资产归还明细信息
        const objResults = await broker.call('objectql.find', {
            objectName: "asset_return_detail",
            query: {
                filters: ["asset_return","=",doc._id]
            }
        })
        for(let objResult of objResults){
            console.log("资产归还明细",objResult);
            // 查询资产卡片信息
           const assetsCard = await this.findAssetsCard(objResult.assets_card); 
            let assetsCardDoc = {
                quantity:assetsCard.quantity+objResult.quantity,
                status:"在库",
                users:"",
                dept:"",
                receiving_date: null
            }
            console.log("修改资产卡片信息",assetsCardDoc)
            //修改资产卡片信息
            await this.updateAssetsCard(assetsCardDoc,assetsCard._id); 
        }
    }
}