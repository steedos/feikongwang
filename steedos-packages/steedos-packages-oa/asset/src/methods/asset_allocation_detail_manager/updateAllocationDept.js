/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 14:20:37
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 14:22:10
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/asset/src/methods/asset_allocation_detail_managers/updateAllocationDept.js
 * @Description: 
 */
'use strict';
// @ts-check

module.exports = {
    /**
     * 更新调拨记录的调出部门
     * @param {*} detailId 调拨明细id
     */
    async handler(detailId) {
        const detail = await this.getObject('asset_allocation_detail').findOne({ filters: [['_id', '=', detailId]] });
        const card = await this.getObject('assets_card').findOne({ filters: [['_id', '=', detail.assets_card]] });

        await this.getObject('asset_allocation').directUpdate(detail.asset_allocation, { dept: card.dept });
    }
}
/**
 * async function updateAllocationDept(detailId) {
    const detail = await objectql.getObject('asset_allocation_detail').findOne({ filters: [['_id', '=', detailId]] });
    const card = await objectql.getObject('assets_card').findOne({ filters: [['_id', '=', detail.assets_card]] });

    await objectql.getObject('asset_allocation').directUpdate(detail.asset_allocation, { dept: card.dept });
}
 */