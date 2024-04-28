module.exports = {
    handler: async function (ctx) {
        const doc = ctx.params.doc;
        console.log("资产借用审批通过》〉》〉》〉》")
        console.log("资产借用信息",doc)
        //查询资产借用明细信息
        const objResults = await broker.call('objectql.find', {
            objectName: "asset_borrowing_detail",
            query: {
                filters: ["asset_borrowing","=",doc._id]
            }
        })
        for(let objResult of objResults){
            console.log("资产借用明细",objResult);
            // 查询资产卡片信息
           const assetsCard = await this.findAssetsCard(objResult.assets_card); 
            let assetsCardDoc = {
                quantity:assetsCard.quantity-objResult.quantity,
                users:doc.applicant,
                dept:doc.dept,
                receiving_date:doc.borrow_date,
                status:"使用中"
            }
            console.log("修改资产卡片信息",assetsCardDoc)
            //修改资产卡片信息
            await this.updateAssetsCard(assetsCardDoc,assetsCard._id); 
        }
    }
}