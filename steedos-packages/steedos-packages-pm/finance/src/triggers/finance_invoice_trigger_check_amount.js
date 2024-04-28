/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-25 13:30:14
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-25 13:38:17
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/finance/src/triggers/finance_invoice_trigger_check_amount.js
 * @Description: 
 */
const { default: BigNumber } = require('bignumber.js');
module.exports = {
    trigger: {
        listenTo: 'finance_invoice', // 开票
        when: [
            'beforeInsert',
            'beforeUpdate',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;
        if (isBefore) {
            const that = this
            // 开票记录的累计金额应不大于所属的合同总金额（已开票的总金额加当前记录的发票金额，不大于合同金额，保存时校验）
            const checkAmount = async function (invoiceId, amount, contractId) {
                let financeInvoices = await that.getObject('finance_invoice').find({ filters: [['contract', '=', contractId], ['_id', '!=', invoiceId]] });
                let contract = await that.getObject('contracts').findOne(contractId);
                let totalAmount = new BigNumber(amount || 0);
                for (const rInvoice of financeInvoices) {
                    totalAmount = totalAmount.plus(new BigNumber(rInvoice.money || 0));
                }
                let applyAmount = new BigNumber(contract.amount || 0);
                if (totalAmount.isGreaterThan(applyAmount)) {
                    throw new Error('开票记录的累计金额应不大于所属的合同总金额。');
                }
            }
            if (isInsert) {
                if (doc.contract) {
                    await checkAmount(id, doc.money, doc.contract);
                }
            }
            if (isUpdate) {
                if (doc.contract) {
                    let financeInvoice = await this.getObject('finance_invoice').findOne(id, { fields: ['contract'] });
                    await checkAmount(id, doc.money, financeInvoice.contract);
                }
            }
        }
    }
}
/**
 *  const objectql = require('@steedos/objectql');
const { default: BigNumber } = require('bignumber.js');
// 开票
module.exports = {
    listenTo: 'finance_invoice',

    beforeInsert: async function () {
        let doc = this.doc;
        if (doc.contract) {
            await checkAmount(this.id, doc.money, doc.contract);
        }
    },

    beforeUpdate: async function () {
        let doc = this.doc;
        if (doc.contract) {
            let financeInvoice = await this.getObject('finance_invoice').findOne(this.id, { fields: ['contract'] });
            await checkAmount(this.id, doc.money, financeInvoice.contract);
        }
    }
};

// 开票记录的累计金额应不大于所属的合同总金额（已开票的总金额加当前记录的发票金额，不大于合同金额，保存时校验）
async function checkAmount(invoiceId, amount, contractId) {
    let steedosSchema = objectql.getSteedosSchema();
    let financeInvoices = await steedosSchema.getObject('finance_invoice').find({ filters: [['contract', '=', contractId], ['_id', '!=', invoiceId]] });
    let contract = await steedosSchema.getObject('contracts').findOne(contractId);
    let totalAmount = new BigNumber(amount || 0);
    for (const rInvoice of financeInvoices) {
        totalAmount = totalAmount.plus(new BigNumber(rInvoice.money || 0));
    }
    let applyAmount = new BigNumber(contract.amount || 0);
    if (totalAmount.isGreaterThan(applyAmount)) {
        throw new Error('开票记录的累计金额应不大于所属的合同总金额。');
    }
}
 */