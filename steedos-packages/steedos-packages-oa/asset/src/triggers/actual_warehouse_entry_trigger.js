/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 13:54:40
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 15:25:16
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/asset/src/triggers/actual_warehouse_entry_trigger.js
 * @Description: 
 */
module.exports = {
    trigger: {
        listenTo: 'actual_warehouse_entry', // TODO 未找到此对象定义
        when: [
            'afterUpdate',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;

        if (isAfter) {
            if (isUpdate) {
                // const doc = await this.getObject('actual_warehouse_entry').findOne(id);
                var inboundDoc = {};
                if (doc.stock_state == 'pending') {
                    // 批准中的数据将本次入库数量加入计划入库明细的已入库数量
                    const entries = await this.getObject('assets_warehouse_entry').find({ filters: [['actual_warehouse_entry', '=', id]] });
                    for (const doc of entries) {
                        inboundDoc.stocked_quantity = doc.stocked_quantity + doc.warehousing_quantity;
                        await this.getObject("warehousing_detail").update(doc.warehousing_detail, inboundDoc);
                        const result = await this.getObject('assets_warehouse_entry').find({ filters: [['warehousing_detail', '=', doc.warehousing_detail]] });
                        for (const item of result) {
                            await this.getObject("assets_warehouse_entry").update(item._id, inboundDoc);
                        }
                    }
                }
                if (doc.stock_state == 'rejected' || doc.stock_state == 'terminated') {
                    // 驳回的和取消的数据将本次入库数量从计划入库明细的已入库数量中减去
                    const entries = await this.getObject('assets_warehouse_entry').find({ filters: [['actual_warehouse_entry', '=', id]] });
                    for (const doc of entries) {
                        inboundDoc.stocked_quantity = doc.stocked_quantity - doc.warehousing_quantity;
                        await this.getObject("warehousing_detail").update(doc.warehousing_detail, inboundDoc);
                        const result = await this.getObject('assets_warehouse_entry').find({ filters: [['warehousing_detail', '=', doc.warehousing_detail]] });
                        for (const item of result) {
                            await this.getObject("assets_warehouse_entry").directUpdate(item._id, inboundDoc);
                        }
                    }
                }
                if (doc.stock_state == 'approved' && doc.stock_state != previousDoc.stock_state) {
                    // 将实际入库单中的明细数据插入生成资产卡片 #256
                    const entries = await this.getObject('assets_warehouse_entry').find({ filters: [['actual_warehouse_entry', '=', id]] });
                    const cardObj = this.getObject('assets_card');
                    const baseInfo = {
                        created: new Date,
                        modified: new Date,
                        inbound_date: new Date,
                        is_active: true,
                    }
                    for (const doc of entries) {
                        delete doc._id;
                        const product = await this.getObject('product').findOne(doc.product);
                        // var product = Creator.odata.get("product", doc.product, "name,separate_accounting,material_group,asset_type,product_currency,manufacturer,supplier,is_asset,unit");
                        if (!product.separate_accounting || product.separate_accounting == false) {
                            doc.quantity = doc.warehousing_quantity;
                            doc.attributes = "外购";
                            doc.amount = product.amount;
                            doc.asset_type = product.asset_type;
                            doc.currency = product.product_currency;
                            doc.unit = product.unit;
                            doc.manufacturer = product.manufacturer;
                            doc.supplier = product.supplier;
                            doc.inventory = product.inventory;
                            await cardObj.insert({
                                ...doc,
                                ...baseInfo,
                            })
                        } else {
                            for (i = 0; i < doc.warehousing_quantity; i++) {
                                // 拆分单独核算的入库明细
                                doc.quantity = 1;
                                doc.attributes = "外购";
                                doc.amount = product.amount;
                                doc.asset_type = product.asset_type;
                                doc.currency = product.product_currency;
                                doc.unit = product.unit;
                                doc.manufacturer = product.manufacturer;
                                doc.supplier = product.supplier;
                                doc.inventory = product.inventory;
                                await cardObj.insert({
                                    ...doc,
                                    ...baseInfo,
                                })
                            }
                        }
                    }
                    // 更新实际入库单的入库日期
                    var orderDoc = {};
                    orderDoc.demanded_date = new Date;
                    await this.getObject("actual_warehouse_entry").update(id, orderDoc);
                }
            }
        }
    }
}

/**
 * const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'actual_warehouse_entry',

    beforeInsert: async function () {

    },

    beforeUpdate: async function () {

    },

    beforeDelete: async function () {

    },

    afterInsert: async function () {

    },

    afterUpdate: async function () {
        const id = this.doc._id;
        const previousDoc = this.previousDoc;
        // const doc = await this.getObject('actual_warehouse_entry').findOne(id);
        var inboundDoc = {};
        if (this.doc.stock_state == 'pending') {
            // 批准中的数据将本次入库数量加入计划入库明细的已入库数量
            const entries = await this.getObject('assets_warehouse_entry').find({ filters: [['actual_warehouse_entry', '=', id]] });
            for (const doc of entries) {
                inboundDoc.stocked_quantity = doc.stocked_quantity + doc.warehousing_quantity;
                await this.getObject("warehousing_detail").update(doc.warehousing_detail, inboundDoc);
                const result = await this.getObject('assets_warehouse_entry').find({ filters: [['warehousing_detail', '=', doc.warehousing_detail]] });
                for (const item of result) {
                    await this.getObject("assets_warehouse_entry").update(item._id, inboundDoc);
                }
            }
        }
        if (this.doc.stock_state == 'rejected' || this.doc.stock_state == 'terminated') {
            // 驳回的和取消的数据将本次入库数量从计划入库明细的已入库数量中减去
            const entries = await this.getObject('assets_warehouse_entry').find({ filters: [['actual_warehouse_entry', '=', id]] });
            for (const doc of entries) {
                inboundDoc.stocked_quantity = doc.stocked_quantity - doc.warehousing_quantity;
                await this.getObject("warehousing_detail").update(doc.warehousing_detail, inboundDoc);
                const result = await this.getObject('assets_warehouse_entry').find({ filters: [['warehousing_detail', '=', doc.warehousing_detail]] });
                for (const item of result) {
                    await this.getObject("assets_warehouse_entry").directUpdate(item._id, inboundDoc);
                }
            }
        }
        if (this.doc.stock_state == 'approved' && this.doc.stock_state != previousDoc.stock_state) {
            // 将实际入库单中的明细数据插入生成资产卡片 #256
            const entries = await this.getObject('assets_warehouse_entry').find({ filters: [['actual_warehouse_entry', '=', id]] });
            const cardObj = this.getObject('assets_card');
            const baseInfo = {
                created: new Date,
                modified: new Date,
                inbound_date: new Date,
                is_active: true,
            }
            for (const doc of entries) {
                delete doc._id;
                const product = await this.getObject('product').findOne(doc.product);
                // var product = Creator.odata.get("product", doc.product, "name,separate_accounting,material_group,asset_type,product_currency,manufacturer,supplier,is_asset,unit");
                if (!product.separate_accounting || product.separate_accounting == false) {
                    doc.quantity = doc.warehousing_quantity;
                    doc.attributes = "外购";
                    doc.amount = product.amount;
                    doc.asset_type = product.asset_type;
                    doc.currency = product.product_currency;
                    doc.unit = product.unit;
                    doc.manufacturer = product.manufacturer;
                    doc.supplier = product.supplier;
                    doc.inventory = product.inventory;
                    await cardObj.insert({
                        ...doc,
                        ...baseInfo,
                    })
                }else {
                    for (i = 0; i < doc.warehousing_quantity; i++) {
                        // 拆分单独核算的入库明细
                        doc.quantity = 1;
                        doc.attributes = "外购";
                        doc.amount = product.amount;
                        doc.asset_type = product.asset_type;
                        doc.currency = product.product_currency;
                        doc.unit = product.unit;
                        doc.manufacturer = product.manufacturer;
                        doc.supplier = product.supplier;
                        doc.inventory = product.inventory;
                        await cardObj.insert({
                            ...doc,
                            ...baseInfo,
                        })
                    }
                }
            }
            // 更新实际入库单的入库日期
            var orderDoc = {};
            orderDoc.demanded_date = new Date;
            await this.getObject("actual_warehouse_entry").update(id, orderDoc);
        }
    },

    afterDelete: async function () {

    },

}
 */