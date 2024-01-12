module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/api/purchase/purchase_orders/add/invoices'
    },
    params: {
        invoices: { type: 'string' }, // 发票信息
        purchaseOrdersId: {type: 'string'} //应付合同id
    },
    async handler(ctx) {
        /**
         * 勾选单/多条记录后，将“费用”对象对应记录的“报销”字段更新为当前“费用”对象记录；
         */
        const {invoices,purchaseOrdersId} = ctx.params;
        console.log("应付合同关联发票");
        console.log("purchaseOrdersId",purchaseOrdersId)
        const invoicesObj = this.getObject('invoices');
        let reportsInvoices = JSON.parse(invoices)
        for(let reportsInvoice of reportsInvoices){
            await invoicesObj.directUpdate(reportsInvoice._id, {
                purchase_order:purchaseOrdersId,
                state: "unsubmitted"
            })
           
        }


    }
}