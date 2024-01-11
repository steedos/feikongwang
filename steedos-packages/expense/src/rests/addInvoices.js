module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/api/expense/expense_reports/add/invoices'
    },
    params: {
        invoices: { type: 'string' }, // 发票信息
        expenseReportsId: {type: 'string'} //报销单id
    },
    async handler(ctx) {
        /**
         * 勾选单/多条记录后，将“费用”对象对应记录的“报销”字段更新为当前“费用”对象记录；
         */
        const {invoices,expenseReportsId} = ctx.params;
        const invoicesObj = this.getObject('invoices');
        let reportsInvoices = JSON.parse(invoices)
        for(let reportsInvoice of reportsInvoices){
            await invoicesObj.directUpdate(reportsInvoice._id, {
                expense_reports:expenseReportsId,
                state: "unsubmitted"
            })
           
        }

    }
}