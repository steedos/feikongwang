module.exports = {
    trigger: {
        listenTo: 'purchase_stock_delivery', // 入库交货明细
        when: [
            'afterInsert',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;

        if (isAfter) {
            if (isInsert) {
                const query = {
                    fields: [],

                };

                //获取入库详情信息
                const stock_picking_itemInfo = await this.getObject("purchase_stock_delivery").findOne(id, query);
                //获取入库项信息
                const stock_pickingInfo = await this.getObject("purchase_stock_picking_item").findOne(stock_picking_itemInfo.stock_picking_item_id, query);
                //获取订单项下的所有入库项信息
                const stock_pickingList = await this.getObject("purchase_stock_picking_item").find({ fields: [], filters: [['purchase_order_line', 'contains', stock_pickingInfo.purchase_order_line]] });

                let num = 0;
                for (const key in stock_pickingList) {
                    if (typeof (stock_pickingList[key]) == 'object') {
                        const stock_deliveryList = await this.getObject("purchase_stock_delivery").find({ fields: [], filters: [['stock_picking_item_id', 'contains', stock_pickingList[key]._id]] });

                        for (const key in stock_deliveryList) {
                            if (typeof (stock_deliveryList[key]) == 'object') {

                                num = num + stock_deliveryList[key].amount_received;
                            }
                        }
                    }
                }


                const result = await this.getObject("purchase_order_item").update(stock_pickingInfo.purchase_order_line, { amount_receiverd: num, delivery_date: new Date() });

                const psQuery = {
                    fields: ['num'],
                    filters: [['product', 'contains', doc.product_id], ["warehouse", 'contains', doc.warehouse], ["location", 'contains', doc.location]],
                    sort: 'created desc'
                };

                const psResult = await this.getObject("purchase_product_stock").find(psQuery);
                console.log(psResult.length)
                var now = new Date();

                const proInfo = await this.getObject("product").findOne(doc.product_id, []);
                console.log(proInfo)

                if (psResult.length == 0) {
                    const psDoc = {
                        name: proInfo.name,
                        product: doc.product_id,
                        warehouse: doc.warehouse,
                        location: doc.location,
                        created_by: userId,
                        modified_by: userId,
                        created: now,
                        modified: now,
                        space: spaceId,
                        num: doc.amount_received

                    };
                    console.log(await this.getObject("purchase_product_stock").insert(psDoc))

                } else {
                    const result = await this.getObject("purchase_product_stock").update(psResult[0]['_id'], { num: psResult[0]['num'] + doc.amount_received })
                }

                console.log("=====================================")
                // 最终判断是否完成

                if (doc.amount_demand == doc.amount_received) {
                    stock_picking_itemCheckList = await this.getObject("purchase_stock_picking_item").find({ fields: [], filters: [['stock_picking_id', 'contains', stock_pickingInfo.stock_picking_id]] });
                    var end = true;
                    for (const key in stock_picking_itemCheckList) {
                        if (typeof (stock_picking_itemCheckList[key]) == 'object') {
                            if (stock_picking_itemCheckList[key]._id != doc.stock_picking_item_id && stock_picking_itemCheckList[key].amount_demand != stock_picking_itemCheckList[key].amount_received) {
                                end = false;
                            }
                        }
                    }
                    console.log(stock_picking_itemCheckList)
                    if (end) {
                        await this.getObject("purchase_stock_picking").update(stock_pickingInfo.stock_picking_id, { 'state': "已入库" })
                        const stock_pickingCheckInfo = await this.getObject("purchase_stock_picking").findOne({ fields: [], filters: [['_id', 'contains', stock_pickingInfo.stock_picking_id]] });
                        await this.getObject("purchase_order").update(stock_pickingCheckInfo.purchase_order_id, { 'state': "结束" })
                    }
                }
                console.log("=====================================")




            }
        }
    }
}
/**
 * const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'purchase_stock_delivery',

    afterInsert: async function(){
        const query = {
            fields: [],
            
        };
        const { spaceId, userId } = this

        //获取入库详情信息
        const stock_picking_itemInfo = await objectql.getObject("purchase_stock_delivery").findOne(this.id, query);
        //获取入库项信息
        const stock_pickingInfo = await objectql.getObject("purchase_stock_picking_item").findOne(stock_picking_itemInfo.stock_picking_item_id, query);
        //获取订单项下的所有入库项信息
        const stock_pickingList = await objectql.getObject("purchase_stock_picking_item").find( { fields: [],filters: [['purchase_order_line','contains',stock_pickingInfo.purchase_order_line]]});
        
        let num = 0;
        for (const key in stock_pickingList) {
            if(typeof(stock_pickingList[key]) == 'object'){
                const stock_deliveryList = await objectql.getObject("purchase_stock_delivery").find( { fields: [],filters: [['stock_picking_item_id','contains',stock_pickingList[key]._id]]});

                for (const key in stock_deliveryList) {
                    if(typeof(stock_deliveryList[key]) == 'object'){
                        
                        num = num + stock_deliveryList[key].amount_received;
                    }
                }
            }
        }
        
        
        const result = await objectql.getObject("purchase_order_item").update(stock_pickingInfo.purchase_order_line, {amount_receiverd:num,delivery_date:new Date()});

        const psQuery = {
            fields: ['num'],
            filters: [['product','contains',this.doc.product_id],["warehouse",'contains',this.doc.warehouse],["location",'contains',this.doc.location]],
            sort: 'created desc'
        };

        const psResult = await objectql.getObject("purchase_product_stock").find(psQuery);
        console.log(psResult.length)
        var now = new Date();

        const proInfo = await objectql.getObject("product").findOne(this.doc.product_id, []);
        console.log(proInfo)

        if(psResult.length == 0){
            const psDoc = {
                name:proInfo.name,
                product:this.doc.product_id,
                warehouse:this.doc.warehouse,
                location:this.doc.location,
                created_by: userId,
                modified_by: userId,
                created: now,
                modified: now,
                space: spaceId,
                num:this.doc.amount_received

            };
            console.log(await objectql.getObject("purchase_product_stock").insert(psDoc))

        }else{
            const result = await objectql.getObject("purchase_product_stock").update(psResult[0]['_id'], {num:psResult[0]['num']+this.doc.amount_received})
        }

        console.log("=====================================")
        // 最终判断是否完成
        
        if(this.doc.amount_demand == this.doc.amount_received){
            stock_picking_itemCheckList = await objectql.getObject("purchase_stock_picking_item").find( { fields: [],filters: [['stock_picking_id','contains',stock_pickingInfo.stock_picking_id]]});
            var end = true;
            for (const key in stock_picking_itemCheckList) {
                if(typeof(stock_picking_itemCheckList[key]) == 'object'){
                    if(stock_picking_itemCheckList[key]._id != this.doc.stock_picking_item_id && stock_picking_itemCheckList[key].amount_demand != stock_picking_itemCheckList[key].amount_received){
                        end = false;
                    }
                }
            }
            console.log(stock_picking_itemCheckList)
            if(end){
                await objectql.getObject("purchase_stock_picking").update(stock_pickingInfo.stock_picking_id,{'state':"已入库"})
                stock_pickingCheckInfo = await objectql.getObject("purchase_stock_picking").findOne( { fields: [],filters: [['_id','contains',stock_pickingInfo.stock_picking_id]]});
                await objectql.getObject("purchase_order").update(stock_pickingCheckInfo.purchase_order_id,{'state':"结束"})
            }
        }
        console.log("=====================================")


        

    },

    afterUpdate: async function(){
       
    },

    afterDelete: async function(){
       
    },

}
 */