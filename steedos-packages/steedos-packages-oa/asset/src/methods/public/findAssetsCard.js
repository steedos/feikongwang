//查询资产卡片信息
module.exports = {
    handler: async function (id) {
         console.log("methods-卡片",id)
        const objResult = await broker.call('objectql.find', {
            objectName: "assets_card",
            query: {
                filters: ["_id","=",id]
            }
        })
        return objResult[0];    
    }
}