/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-09 14:15:05
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-10 14:02:22
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/triggers/invoicesTriggers.js
 * @Description: 
 */
module.exports = {
    trigger: {
        listenTo: 'invoices',
        when: [
            'beforeInsert',
            // 'beforeUpdate', 
            // 'beforeDelete', 
            // 'beforeFind', 
            // 'afterFind', 
            // 'afterInsert', 
            // 'afterUpdate', 
            // 'afterDelete'
        ],
    },
    async handler(ctx) {
        const {
            spaceId,
            objectName,
            isBefore,
            isInsert,
            doc
        } = ctx.params;

        if (isBefore) {

            if (isInsert) {
                // 查重
                const isExists = await this.isInvoiceExists(spaceId, doc.invoice_code, doc.invoice_num)
                if (isExists) {
                    throw new Error('发票已存在')
                }
            }

        }







    }

}
