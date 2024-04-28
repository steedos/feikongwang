/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 14:17:37
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 14:18:52
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/asset/src/methods/asset_allocation_detail_managers/checkDeptIsSame.js
 * @Description: 
 */
'use strict';
// @ts-check

module.exports = {
    /**
     * 校验已有的调拨明细中的资产卡片的使用部门与新增的资产卡片的使用部门是否一致，不一致则报错
     * @param {*} allocationId 
     * @param {*} cardId 
     * @returns 
     */
    async handler(allocationId, cardId) {
        if (!allocationId || !cardId) {
            return;
        }
        const details = await this.getObject('asset_allocation_detail').find({ filters: [['asset_allocation', '=', allocationId]] });
        if (details.length == 0) {
            return;
        }
        const cardIds = details.map(detail => detail.assets_card);
        const cards = await this.getObject('assets_card').find({ filters: [['_id', 'in', cardIds]] });
        const deptIds = cards.map(card => card.dept);
        const card = await this.getObject('assets_card').findOne({ filters: [['_id', '=', cardId]] });
        // 如果已有的调拨明细中的资产卡片的使用部门与新增的资产卡片的使用部门不一致，则报错
        if (deptIds.indexOf(card.dept) == -1) {
            throw new Error(`资产卡片的使用部门与其他的调拨明细的资产卡片的使用部门不一致，请确认。`);
        }
    }
}

/**
 * async function checkDeptIsSame(allocationId, cardId) {
    if (!allocationId || !cardId) {
        return;
    }
    const details = await objectql.getObject('asset_allocation_detail').find({ filters: [['asset_allocation', '=', allocationId]] });
    if (details.length == 0) {
        return;
    }
    const cardIds = details.map(detail => detail.assets_card);
    const cards = await objectql.getObject('assets_card').find({ filters: [['_id', 'in', cardIds]] });
    const deptIds = cards.map(card => card.dept);
    const card = await objectql.getObject('assets_card').findOne({ filters: [['_id', '=', cardId]] });
    // 如果已有的调拨明细中的资产卡片的使用部门与新增的资产卡片的使用部门不一致，则报错
    if (deptIds.indexOf(card.dept) == -1) {
        throw new Error(`资产卡片的使用部门与其他的调拨明细的资产卡片的使用部门不一致，请确认。`);
    }
}
 */