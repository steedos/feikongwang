/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 14:41:39
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 14:41:45
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/asset/src/methods/assets_warehouse_entry_manager/checkEditOrDeleteCondition.js
 * @Description: 
 */
'use strict';
// @ts-check
const FINAL_STOCK_STATUS = ['completed', 'approved', 'rejected', 'terminated'];

module.exports = {
    async handler() {
        // 已通过审批的实际入库单，其下的入库明细不允许编辑和删除
        const doc = await this.getObject('assets_warehouse_entry').findOne(id);
        if (doc.actual_warehouse_entry) {
            const actualWarehouseEntryDoc = await this.getObject('actual_warehouse_entry').findOne(doc.actual_warehouse_entry);
            if (FINAL_STOCK_STATUS.includes(actualWarehouseEntryDoc.stock_state)) {
                throw new Error('已通过审批的实际入库单，其下的入库明细不允许编辑和删除');
            }
        }
    }
}
/**
 * async function checkEditOrDeleteCondition(id) {
    // 已通过审批的实际入库单，其下的入库明细不允许编辑和删除
    const doc = await objectql.getObject('assets_warehouse_entry').findOne(id);
    if (doc.actual_warehouse_entry) {
        const actualWarehouseEntryDoc = await objectql.getObject('actual_warehouse_entry').findOne(doc.actual_warehouse_entry);
        if (FINAL_STOCK_STATUS.includes(actualWarehouseEntryDoc.stock_state)) {
            throw new Error('已通过审批的实际入库单，其下的入库明细不允许编辑和删除');
        }
    }
}
 */