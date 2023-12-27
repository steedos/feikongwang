module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/api/get/stock/picking/numberstatus/:id'
    },
    async handler(ctx) {
        const { id } = ctx.params;

        const stock_picking_itemList = await this.getObject("purchase_stock_picking_item").find({ fields: [], filters: [['stock_picking_id', 'contains', id]] });
        let bool = true;
        for (const key in stock_picking_itemList) {
            if (typeof (stock_picking_itemList[key]) == 'object') {
                if (stock_picking_itemList[key].amount_demand > stock_picking_itemList[key].amount_received) {
                    bool = false;
                }
            }
        }

        return { status: bool }
    }
}
/**
 * const express = require("express");
const router = express.Router();
const core = require('@steedos/core');
const objectql = require('@steedos/objectql');

router.get('/api/get/stock/picking/numberstatus/:id', core.requireAuthentication, async function (req, res) {
    
    
    const stock_picking_itemList = await objectql.getObject("purchase_stock_picking_item").find( { fields: [],filters: [['stock_picking_id','contains',req.params.id]]});
    let bool = true;
    for (const key in stock_picking_itemList) {
        if(typeof(stock_picking_itemList[key]) == 'object'){
            if(stock_picking_itemList[key].amount_demand > stock_picking_itemList[key].amount_received){
                bool = false;
            }
        }
    }
    
    res.status(200).send({ status:bool });


    
});
exports.default = router;
 */