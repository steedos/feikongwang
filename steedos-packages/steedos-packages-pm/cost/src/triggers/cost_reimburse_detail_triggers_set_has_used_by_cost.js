/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-18 10:53:51
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-18 13:35:32
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/cost/src/triggers/cost_reimburse_detail_triggers_set_has_used_by_cost.js
 * @Description: 维护发票台账的has_used_by_cost属性，为了合同付款记录选择发票台账时过滤掉已经被费用选择的发票台账
 */
"use strict";
// @ts-check

const _ = require('lodash')

module.exports = {
    trigger: {
        listenTo: 'cost_reimburse_detail',
        when: [
            'afterInsert',
            'afterUpdate',
            'afterDelete',
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

        const setUsedToFalse = async function (invoiceIds) {
            if (!_.isEmpty(invoiceIds)) {
                for (const invoiceId of invoiceIds) {
                    const costDocs = await costObj.find({
                        filters: [
                            ['invoices', '=', invoiceId]
                        ],
                        fields: ['_id']
                    })
                    if (_.isEmpty(costDocs)) {
                        await invoicesObj.directUpdate(invoiceId, { // 发票未被任何一个费用使用
                            has_used_by_cost: false
                        })
                    }
                }
            }
        }


        if (isAfter) {

            if (isInsert) {
                const { invoices } = doc
                if (!_.isEmpty(invoices)) {
                    await invoicesObj.updateMany([
                        ['_id', 'in', invoices]
                    ], {
                        has_used_by_cost: true
                    })
                }
            }

            if (isUpdate) {
                const newDoc = await costObj.findOne(id)
                const { invoices } = newDoc
                const { invoices: previousInvoices } = previousDoc
                const newInvoices = _.difference(invoices || [], previousInvoices || []) // 新增的
                const removedInvoices = _.difference(previousInvoices || [], invoices || []) // 移除的

                if (!_.isEmpty(newInvoices)) {
                    await invoicesObj.updateMany([
                        ['_id', 'in', invoices]
                    ], {
                        has_used_by_cost: true
                    })
                }

                await setUsedToFalse(removedInvoices)

            }

            if (isDelete) {
                await setUsedToFalse(previousDoc.invoices)
            }

        }

    }
}

