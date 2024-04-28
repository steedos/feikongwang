/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-18 10:53:51
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-19 13:47:04
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/cost/src/triggers/cost_reimburse_detail_triggers_check_amount.js
 * @Description: 费用的费用金额，不能大于所选发票总金额
 */
"use strict";
// @ts-check

const _ = require('lodash')
const { default: BigNumber } = require('bignumber.js');

module.exports = {
    trigger: {
        listenTo: 'cost_reimburse_detail',
        when: [
            'beforeInsert',
            'beforeUpdate',
        ],
    },
    async handler(ctx) {
        const {
            spaceId,
            objectName,
            isBefore,
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

        if (isBefore) {

            if (isInsert || isUpdate) {
                let { amount, invoices } = doc
                if (isUpdate) { // 考虑编辑单个字段的情况
                    const currentDoc = await costObj.findOne(id, { fields: ['amount', 'invoices'] })
                    if (_.isEmpty(invoices)) {
                        invoices = currentDoc.invoices
                    }
                    if (!amount) {
                        amount = currentDoc.amount || 0
                    }
                }

                if (!_.isEmpty(invoices)) { // 计算发票总金额
                    const invoiceDocs = await invoicesObj.find({
                        filters: [
                            ['_id', 'in', invoices]
                        ],
                        fields: ['invoice_amount']
                    })
                    let totalAmount = new BigNumber(0);
                    for (const doc of invoiceDocs) {
                        totalAmount = totalAmount.plus(new BigNumber(doc.invoice_amount || 0));
                    }
                    totalAmount = totalAmount.toNumber()
                    if (amount > totalAmount) {
                        throw new Error('报销金额超过发票可报金额，请检查')
                    }
                }


            }

        }

    }
}

