/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-16 09:39:37
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-12-19 13:42:37
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/finance/src/triggers/finance_payment_triggers.js
 * @Description: 
 */
"use strict";
// @ts-check

const _ = require('lodash')
const { default: BigNumber } = require('bignumber.js');

module.exports = {
    trigger: {
        listenTo: 'finance_payment',
        when: [
            'beforeInsert',
            'beforeUpdate',
            // 'beforeDelete', 
            // 'beforeFind', 
            // 'afterFind', 
            'afterInsert',
            'afterUpdate',
            // 'afterDelete'
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
            doc,
            id,
            previousDoc,
        } = ctx.params;

        const invoicesObj = this.getObject('invoices')
        const contractObj = this.getObject('contracts')


        if (isBefore) {

            if (isInsert || isUpdate) {

                const { payment_invoicefolder: invoiceIds, amount } = doc
                if (!_.isEmpty(invoiceIds)) {

                    // 付款单的 发票总金额、发票张数
                    const invoiceDocs = await invoicesObj.find({
                        filters: [
                            ['_id', 'in', invoiceIds]
                        ]
                    })
                    let totalAmount = new BigNumber(0);
                    for (const doc of invoiceDocs) {
                        totalAmount = totalAmount.plus(new BigNumber(doc.invoice_amount || 0));
                    }
                    totalAmount = totalAmount.toNumber()

                    // 发票金额需大于等于付款金额
                    if (totalAmount < amount) {
                        throw new Error('发票金额需大于等于付款金额')
                    }

                    doc.payment_invoicefolder_total_amount = totalAmount // 发票总金额
                    doc.payment_invoicefolder_count = invoiceDocs.length // 发票张数

                    return {
                        doc
                    }

                }


            }
        }


        if (isAfter) {

            if (isInsert || isUpdate) {
                // 将选择的发票台账绑定到付款记录、合同
                const { payment_invoicefolder: invoiceIds, contract: contractId } = doc
                if (!_.isEmpty(invoiceIds) && !_.isEmpty(contractId)) {
                    for (const invoiceId of invoiceIds) {
                        await invoicesObj.directUpdate(invoiceId, {
                            contract: contractId,
                            finance_payment: id,
                        })
                    }


                }

            }

            // 解绑旧的付款记录、合同
            if (isUpdate) {
                const { payment_invoicefolder: invoiceIds, contract: contractId } = doc
                const previousInvoiceIds = previousDoc.payment_invoicefolder
                const removedInvoiceIds = _.difference(previousInvoiceIds || [], invoiceIds || [])
                for (const invoiceId of removedInvoiceIds) {
                    const invoiceDoc = await invoicesObj.findOne(invoiceId, {
                        fields: ['_id']
                    })
                    if (invoiceDoc) {
                        await invoicesObj.directUpdate(invoiceDoc._id, {
                            contract: null,
                            finance_payment: null,
                        })
                    }
                }
            }

        }







    }
}
