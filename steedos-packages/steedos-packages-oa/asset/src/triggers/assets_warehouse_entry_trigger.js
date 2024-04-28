/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 15:15:04
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 15:30:25
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/asset/src/triggers/assets_warehouse_entry_trigger.js
 * @Description: 
 */
module.exports = {
    trigger: {
        listenTo: 'assets_warehouse_entry', // TODO 未找到此对象定义
        when: [
            'beforeUpdate',
            'beforeDelete',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;
        if (isBefore) {

            if (isUpdate) {
                await this.checkEditOrDeleteCondition(id);
            }
            if (isDelete) {
                await this.checkEditOrDeleteCondition(id);
            }

        }

    }
}
/**
 * const manager = require('../managers/assets_warehouse_entry');

module.exports = {
    listenTo: 'assets_warehouse_entry',

    beforeInsert: async function(){
    
    },

    beforeUpdate: async function(){
        const { id } = this;
        await manager.checkEditOrDeleteCondition(id);
    },

    beforeDelete: async function(){
        const { id } = this;
        await manager.checkEditOrDeleteCondition(id);
    },

    afterInsert: async function(){
    
    },

    afterUpdate: async function(){
    
    },

    afterDelete: async function(){
    
    },

}
 */