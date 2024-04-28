/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 14:03:55
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 15:25:38
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/asset/src/triggers/asset_allocation_detail_trigger.js
 * @Description: 
 */
module.exports = {
    trigger: {
        listenTo: 'asset_allocation_detail', // TODO 未找到此对象定义
        when: [
            'beforeInsert',
            'beforeUpdate',
            'afterInsert',
            'afterUpdate',
            'afterDelete'
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;
        if (isBefore) {
            if (isInsert) {
                const { asset_allocation, assets_card } = doc;
                // 校验选择的资产卡片的使用部门是否与其他的调拨明细的资产卡片的使用部门一致
                await this.checkDeptIsSame(asset_allocation, assets_card);
            }
            if (isUpdate) {
                const { assets_card } = doc;
                const currentDoc = await this.getObject('asset_allocation_detail').findOne(id);
                if (assets_card && assets_card != currentDoc.assets_card) {
                    // 校验选择的资产卡片的使用部门是否与其他的调拨明细的资产卡片的使用部门一致
                    await this.checkDeptIsSame(currentDoc.asset_allocation, assets_card);
                }
            }
        }
        if (isAfter) {
            if (isInsert) {
                const asset_allocation = "asset_allocation";
                const asset_allocation_detail = "asset_allocation_detail";
                await this.setAssetCardField(doc.asset_allocation, asset_allocation, asset_allocation_detail);

                await this.updateAllocationDept(this.id);
            }
            if (isUpdate) {
                const asset_allocation = "asset_allocation";
                const asset_allocation_detail = "asset_allocation_detail";
                await this.setAssetCardField(doc.asset_allocation, asset_allocation, asset_allocation_detail);

                await this.updateAllocationDept(this.id);
            }
            if (isDelete) {
                const asset_allocation = "asset_allocation";
                const asset_allocation_detail = "asset_allocation_detail";
                await this.setAssetCardField(previousDoc.asset_allocation, asset_allocation, asset_allocation_detail);
            }
        }
    }
}

/**
 * onst objectql = require('@steedos/objectql');
const details = require('../details/asset_details');
const manager = require('../managers/asset_allocation_detail');

module.exports = {
    listenTo: 'asset_allocation_detail',

    beforeInsert: async function(){
        const { doc } = this;
        const { asset_allocation, assets_card } = doc;
        // 校验选择的资产卡片的使用部门是否与其他的调拨明细的资产卡片的使用部门一致
        await manager.checkDeptIsSame(asset_allocation, assets_card);
    },

    beforeUpdate: async function(){
        const { doc, id } = this;
        const { assets_card } = doc;
        const currentDoc = await this.getObject('asset_allocation_detail').findOne(id);
        if (assets_card && assets_card != currentDoc.assets_card) {
            // 校验选择的资产卡片的使用部门是否与其他的调拨明细的资产卡片的使用部门一致
            await manager.checkDeptIsSame(currentDoc.asset_allocation, assets_card);
        }
    },

    beforeDelete: async function(){
    
    },

    afterInsert: async function(){
        const doc = this.doc;
        const asset_allocation = "asset_allocation";
        const asset_allocation_detail = "asset_allocation_detail";
        await details.setAssetCardField(doc.asset_allocation,asset_allocation,asset_allocation_detail);

        await manager.updateAllocationDept(this.id);
    },

    afterUpdate: async function(){
        const doc = this.doc;
        const asset_allocation = "asset_allocation";
        const asset_allocation_detail = "asset_allocation_detail";
        await details.setAssetCardField(doc.asset_allocation,asset_allocation,asset_allocation_detail);

        await manager.updateAllocationDept(this.id);
    },

    afterDelete: async function(){
        const previousDoc = this.previousDoc;
        const asset_allocation = "asset_allocation";
        const asset_allocation_detail = "asset_allocation_detail";
        await details.setAssetCardField(previousDoc.asset_allocation,asset_allocation,asset_allocation_detail);
    },

}
 */