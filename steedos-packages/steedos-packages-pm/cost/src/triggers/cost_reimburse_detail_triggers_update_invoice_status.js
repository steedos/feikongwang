/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-18 10:53:51
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-19 13:51:28
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/cost/src/triggers/cost_reimburse_detail_triggers_update_invoice_status.js
 * @Description: 费用的报销状态变化后更新发票台账的报销状态
 */
"use strict";
// @ts-check

const _ = require('lodash')

module.exports = {
    trigger: {
        listenTo: 'cost_reimburse_detail',
        when: [
            'afterUpdate',
        ],
    },
    async handler(ctx) {
        const {
            spaceId,
            objectName,
            isAfter,
            isInsert,
            isUpdate,
            isDelete,
            doc,
            previousDoc,
            id,
        } = ctx.params;

        const invoicesObj = this.getObject('invoices')
        const costObj = this.getObject(objectName)

        if (isAfter) {

            if (isUpdate) {
                if (doc.status && doc.status !== previousDoc.status) {
                    const newDoc = await costObj.findOne(id)
                    const { invoices } = newDoc

                    if (!_.isEmpty(invoices)) {
                        await invoicesObj.updateMany([
                            ['_id', 'in', invoices]
                        ], {
                            status: doc.status
                        })
                    }
                }

            }

        }

    }
}

