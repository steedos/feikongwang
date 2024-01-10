module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/api/expense/expense_reports/add/expense_advance_payment'
    },
    params: {
        expenseAdvancePayment: { type: 'string' }, // 报销信息
        expenseReportsId: {type: 'string'} //报销单id
    },
    async handler(ctx) {
        /**
         * 勾选单/多条记录后，将“报销”对象对应记录的“报销”字段更新为当前“借款”对象记录
         */
        const {expenseAdvancePayment,expenseReportsId} = ctx.params;
        const expenseAdvancePaymentObj = this.getObject('expense_advance_payment');
        let expenseAdvancePayments = JSON.parse(expenseAdvancePayment)
        for(let expense_advance_payment of expenseAdvancePayments){
            await expenseAdvancePaymentObj.update(expense_advance_payment._id, {
                expense_reports:expenseReportsId
            })
        }

    }
}