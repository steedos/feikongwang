module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/finance/finance_invoice/autoFill/finance_invoice'
    },
    params: {
        account: { type: 'string' }, // 客户id
    },
    async handler(ctx) {
        /**
         * 根据客户id查询开票信息与邮寄信息,autoFill开票记录
         */
        const { account } = ctx.params;
        const invoiceInformationObj = this.getObject('invoice_information');
        const mailingInformationObj = this.getObject('mailing_information');
        // 查询开票信息
        let invoiceInformationDoc = await invoiceInformationObj.findOne({ filters: [['customer', '=', account], ['default', '=', true]] });
        // 查询邮寄信息
        let mailingInformationDoc = await mailingInformationObj.findOne({ filters: [['customer', '=', account], ['default', '=', true]] });
        let data = {}
        if (invoiceInformationDoc && mailingInformationDoc) {
            invoiceInformationDoc.recipient = mailingInformationDoc.name ? mailingInformationDoc.name : null
            invoiceInformationDoc.telephont = mailingInformationDoc.phone ? mailingInformationDoc.phone : null
            invoiceInformationDoc.mail = mailingInformationDoc.email ? mailingInformationDoc.email : null
            invoiceInformationDoc.mail_address = mailingInformationDoc.address ? mailingInformationDoc.address : null
            data = invoiceInformationDoc
        } else if (invoiceInformationDoc && !mailingInformationDoc) {
            data = invoiceInformationDoc
        } else if (!invoiceInformationDoc && mailingInformationDoc) {
            data = mailingInformationDoc
        }
        console.log("data", data)
        console.log("====开票", invoiceInformationDoc);
        console.log("======>", mailingInformationDoc);
        return {
            data:data,
            msg:"",
            status:0
        }
    }
}