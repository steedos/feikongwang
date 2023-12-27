module.exports = {
    trigger: {
        listenTo: 'purchase_order', // 采购订单
        when: [
            'afterUpdate',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;

        if (isAfter) {

            if (isUpdate) {

                if (doc.state == "入库") {

                    const objectApiName = "purchase_order";
                    var now = new Date();
                    const query = {
                        fields: [],

                    };
                    const result = await this.getObject(objectApiName).findOne(id, query);

                    const stock_picking_doc = {
                        partner: result.vendor,
                        state: '入库中',
                        warehouse_id: result.warehouse_id,
                        location_id: result.location_id,
                        purchase_order_id: id,
                        created_by: userId,
                        modified_by: userId,
                        created: now,
                        modified: now,
                        space: spaceId,
                    }

                    const pick_result = await this.getObject("purchase_stock_picking").insert(stock_picking_doc);


                    const orderItemList = await this.getObject("purchase_order_item").find({ fields: [], filters: [['purchase_order', 'contains', id]] });

                    for (const key in orderItemList) {

                        if (typeof (orderItemList[key]) == 'object') {
                            const stock_picking_item_doc = {
                                product_id: orderItemList[key].material_coding,
                                amount_demand: orderItemList[key].amount_demand,
                                amount_received: 0,
                                unit: orderItemList[key].unit,
                                purchase_order_line: orderItemList[key]._id,
                                stock_picking_id: pick_result._id,
                                space: spaceId,
                                created_by: userId,
                                modified_by: userId,
                                created: now,
                                modified: now


                            }
                            const stock_picking_item_result = await this.getObject("purchase_stock_picking_item").insert(stock_picking_item_doc);
                        }

                    }




                }
            }

        }
    }
}
/**
 * const objectql = require('@steedos/objectql');
const { isNumber } = require('lodash');

module.exports = {
    listenTo: 'purchase_order',

    afterUpdate: async function(){
        
        if(this.doc.state == "入库"){
            
            const objectApiName = "purchase_order";
            var now = new Date();
            const query = {
                fields: [],
                
            };
            const { spaceId, userId } = this
            const result = await objectql.getObject(objectApiName).findOne(this.id, query);
            
            const stock_picking_doc = {
                partner: result.vendor,
                state: '入库中',
                warehouse_id: result.warehouse_id,
                location_id: result.location_id,
                purchase_order_id: this.id,
                created_by: userId,
                modified_by: userId,
                created: now,
                modified: now,
                space: spaceId,
            }

            const pick_result = await objectql.getObject("purchase_stock_picking").insert(stock_picking_doc);


            const orderItemList = await objectql.getObject("purchase_order_item").find( { fields: [],filters: [['purchase_order','contains',this.id]]});
            
            for (const key in orderItemList) {
                
                if(typeof(orderItemList[key]) == 'object'){
                    const stock_picking_item_doc = {
                        product_id:orderItemList[key].material_coding,
                        amount_demand:orderItemList[key].amount_demand,
                        amount_received:0,
                        unit:orderItemList[key].unit,
                        purchase_order_line:orderItemList[key]._id,
                        stock_picking_id:pick_result._id,
                        space: spaceId,
                        created_by: userId,
                        modified_by: userId,
                        created: now,
                        modified: now
    
    
                    }
                    const stock_picking_item_result = await objectql.getObject("purchase_stock_picking_item").insert(stock_picking_item_doc);
                }
                
            }
             


            
        }
    },

}
 */