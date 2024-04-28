/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 15:23:25
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 15:30:31
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/asset/src/triggers/warehousing_detail_trigger.js
 * @Description: 
 */
module.exports = {
    trigger: {
        listenTo: 'warehousing_detail', // TODO 未找到此对象定义
        when: [
            'beforeInsert',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;
        if (isBefore) {
            if (isInsert) {
                doc.stocked_quantity = 0;
                doc.state = '未入库';
                let warehouse = await this.getObject('warehouse').find({ filters: [['dept', '=', doc.use_dept]] });
                doc.acceptor = warehouse[0].warehouse_keeper;
                return {
                    doc
                }
            }
        }
    }
}

/**
 * const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'warehousing_detail',

    beforeInsert: async function(){
        let doc = this.doc;
        // TODO 设置默认值
        doc.stocked_quantity = 0;
        doc.state = '未入库';
        let steedosSchema = objectql.getSteedosSchema();
        let warehouse = await steedosSchema.getObject('warehouse').find({ filters: [['dept', '=', doc.use_dept]] });
        doc.acceptor = warehouse[0].warehouse_keeper;
    },

}
 */