module.exports = {
    trigger: {
        listenTo: 'asset_allocation', // TODO 未找到此对象定义
        when: [
            'afterUpdate',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;

        if (isAfter) {

            if (isUpdate) {
                const allocation = await this.getObject('asset_allocation').findOne(id);
                //审批中的资产调拨单，明细中的资产状态设为审批中
                if (doc.instance_state == 'pending' && doc.instance_state != previousDoc.instance_state) {
                    const details = await this.getObject('asset_allocation_detail').find({ filters: [['asset_allocation', '=', id]] });
                    for (const doc of details) {
                        var inboundDoc = {
                            status: "审批中"
                        };
                        await this.getObject("assets_card").update(doc.assets_card, inboundDoc);
                    }
                }
                // 审批通过后，将调拨的资产使用部门替换为调入部门
                if (doc.instance_state == 'approved' && doc.instance_state != previousDoc.instance_state) {
                    const entries = await this.getObject('asset_allocation_detail').find({ filters: [['asset_allocation', '=', id]] });
                    for (const doc of entries) {
                        const object = this.getObject("assets_card");
                        //调拨的原资产，使用部门改为调入部门
                        var asset = {
                            dept: allocation.transfer_dept,
                            status: "使用中",
                            users: doc.users, // 资产调拨成功后（审批通过后），资产卡片中的使用人需为调拨明细记录使用人
                            warehouse: doc.warehouse // 存放地点
                        };
                        await object.update(doc.assets_card, asset);
                    }
                }
            }

        }
    }
}

/**
 * const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'asset_allocation',

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
        const allocation = await this.getObject('asset_allocation').findOne(id);
        //审批中的资产调拨单，明细中的资产状态设为审批中
        if (this.doc.instance_state == 'pending' && this.doc.instance_state != previousDoc.instance_state) {
            const details = await this.getObject('asset_allocation_detail').find({ filters: [['asset_allocation', '=', id]] });
            for (const doc of details) {
                var inboundDoc = {
                    status: "审批中"
                };
                await this.getObject("assets_card").update(doc.assets_card, inboundDoc);
            }
        }
        // 审批通过后，将调拨的资产使用部门替换为调入部门
        if (this.doc.instance_state == 'approved' && this.doc.instance_state != previousDoc.instance_state) {
            const entries = await this.getObject('asset_allocation_detail').find({ filters: [['asset_allocation', '=', id]] });
            for (const doc of entries) {
                const object = this.getObject("assets_card");
                //调拨的原资产，使用部门改为调入部门
                var asset = {
                    dept: allocation.transfer_dept,
                    status: "使用中",
                    users: doc.users, // 资产调拨成功后（审批通过后），资产卡片中的使用人需为调拨明细记录使用人
                    warehouse: doc.warehouse // 存放地点
                };
                await object.update(doc.assets_card, asset);
            }
        }
    },

    afterDelete: async function () {

    },

}
 */