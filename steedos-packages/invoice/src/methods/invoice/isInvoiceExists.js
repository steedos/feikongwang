/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-09 13:33:42
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-12 13:15:59
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/isInvoiceExists.js
 * @Description: 发票是否已存在于发票台账中
 */
/**
 * 1、如果只有发票号码，则以发票号码作为查询条件，判断是否已存在
 * 2、如果发票号码和发票代码都有，则以发票号码和发票代码组合作为查询条件，判断是否已存在
 * @param string spaceId 工作区ID
 * @param string invoiceCode 发票代码
 * @param string invoiceNum 发票号码
 * @returns boolean true(已存在)/false(不存在)
 */
module.exports = {
    async handler(spaceId, invoiceCode, invoiceNum) {
        let isExists = true
        const invoiceObj = this.getObject('invoices')
        let filters = []
        if (!invoiceCode && invoiceNum) {
            filters = [
                ['space', '=', spaceId],
                ['invoice_num', '=', invoiceNum]
            ]
        }
        else if (invoiceCode && invoiceNum) {
            filters = [
                ['space', '=', spaceId],
                ['invoice_num', '=', invoiceNum],
                ['invoice_code', '=', invoiceCode]
            ]
        }
        const docs = await invoiceObj.find({
            filters,
            fields: ['_id']
        })
        if (docs.length === 0) {
            isExists = false
        }

        return isExists
    }
}