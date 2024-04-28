/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-12 17:34:41
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-19 11:54:23
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/cost/src/actions/invoice/invoice_create_cost_reimburse_detail.js
 * @Description: 选择发票台账生成费用
 */
"use strict";
// @ts-check

const { default: BigNumber } = require('bignumber.js');

module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/invoice/create_cost_reimburse_detail'
    },
    params: {
        invoiceIds: { type: 'array', items: 'string' },      // 发票台账IDs
        invoiceAllInOne: { type: 'boolean' } // 是否多条发票台账合并生成一条费用
    },
    async handler(ctx) {
        const userSession = ctx.meta.user
        const { userId, organization } = userSession
        const { invoiceIds, invoiceAllInOne } = ctx.params
        // console.log('invoiceIds:', invoiceIds)
        const invoicesObj = this.getObject('invoices')
        const costReimburseDetailObj = this.getObject('cost_reimburse_detail')

        const invoiceDocs = await invoicesObj.find({
            filters: [
                ['_id', 'in', invoiceIds]
            ]
        })

        let createSuccessCount = 0 // 记录创建成功条数

        if (true === invoiceAllInOne) { // 合并发票台账，生成一条费用

            let totalAmount = new BigNumber(0);
            let invoices = []
            for (const doc of invoiceDocs) {
                totalAmount = totalAmount.plus(new BigNumber(doc.invoice_amount || 0));
                invoices.push(doc._id)
            }
            totalAmount = totalAmount.toNumber()
            const result = await costReimburseDetailObj.insert({
                // expend_type 费用类别
                amount: totalAmount,                               // amount 费用金额
                // date 费用日期
                applicant: userId,                                 // applicant 申请人
                department: organization._id,                      // department 部门
                status: 'before',                                  // status 报销状态
                invoices                                           // 关联发票
            }, userSession)

            createSuccessCount++
        }
        else if (false === invoiceAllInOne) {                      // 不合并，每条发票台账生成一条费用
            for (const doc of invoiceDocs) {

                const result = await costReimburseDetailObj.insert({
                    // expend_type 费用类别
                    amount: doc.invoice_amount,                    // amount 费用金额
                    // date 费用日期
                    applicant: userId,                             // applicant 申请人
                    department: organization._id,                  // department 部门
                    status: 'before',                              // status 报销状态
                    invoices: [doc._id]                            // 关联发票
                }, userSession)

                createSuccessCount++
            }
        }




        const msg = `创建成功${createSuccessCount}条，请前往【我的费用】 查看。`
        return {
            "status": 0,
            "msg": msg,
            "data": {}
        }

    }
}