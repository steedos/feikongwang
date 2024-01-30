
const { default: BigNumber } = require('bignumber.js');

module.exports = {
    trigger: {
        listenTo: 'finance_payment', // 付款
        when: [
            'beforeInsert',
            'beforeUpdate',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;
        if (isBefore) {
            const that = this
            // 付款单的累计金额应不大于所属的合同金额（已付款总金额加当前记录的金额，不大于合同总金额，保存时校验）
            const checkAmount = async function (paymentId, amount, contractId) {
                let financePayment = await that.getObject('finance_payment').find({ filters: [['contract', '=', contractId], ['_id', '!=', paymentId]] });
                let contract = await that.getObject('contracts').findOne(contractId);
                let totalAmount = new BigNumber(amount || 0)

                for (const rPayment of financePayment) {
                    totalAmount = totalAmount.plus(new BigNumber(rPayment.amount || 0));
                }
                let applyAmount = new BigNumber(contract.amount || 0);
                if (totalAmount.isGreaterThan(applyAmount)) {
                    throw new Error('付款单的累计金额应不大于合同的总金额。');
                }
            }
            if (isInsert) {
                if (doc.contract) {
                    await checkAmount(id, doc.amount, doc.contract);
                }
            }
            if (isUpdate) {
                if (doc.contract) {
                    let financePayment = await this.getObject('finance_payment').findOne(id, { fields: ['contract'] });
                    await checkAmount(id, doc.amount, financePayment.contract);
                }
            }
        }
    }
}
/**
 * const objectql = require('@steedos/objectql');
const { default: BigNumber } = require('bignumber.js');
const _ = require('underscore');
// 付款单
module.exports = {
    listenTo: 'finance_payment',

    beforeInsert: async function () {
        let doc = this.doc;
        if (doc.contract) {
            await checkAmount(this.id, doc.amount, doc.contract);
        }
    },

    beforeUpdate: async function () {
        let doc = this.doc;
        if (doc.contract) {
            let financePayment = await this.getObject('finance_payment').findOne(this.id, { fields: ['contract'] });
            await checkAmount(this.id, doc.amount, financePayment.contract);
        }
    },
};

// 付款单的累计金额应不大于所属的合同金额（已付款总金额加当前记录的金额，不大于合同总金额，保存时校验）
async function checkAmount(paymentId, amount, contractId) {
    let steedosSchema = objectql.getSteedosSchema();
    let financePayment = await steedosSchema.getObject('finance_payment').find({ filters: [['contract', '=', contractId], ['_id', '!=', paymentId]] });
    let contract = await steedosSchema.getObject('contracts').findOne(contractId);
    let totalAmount = new BigNumber(amount || 0)

    for (const rPayment of financePayment) {
        totalAmount = totalAmount.plus(new BigNumber(rPayment.amount || 0));
    }
    let applyAmount = new BigNumber(contract.amount || 0);
    if (totalAmount.isGreaterThan(applyAmount)) {
        throw new Error('付款单的累计金额应不大于合同的总金额。');
    }
}

 */