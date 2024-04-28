/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-12 10:59:53
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-12 13:57:08
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/convertInvoiceDateStrToDate.js
 * @Description: 
 */
module.exports = {
    /**
     * 将发票识别出的开票日期转为日期类型，如："2023年09月15日" 转为 new Date('2023-09-15T00:00:00.000+0000')
     * @param {string} invoiceDateStr 
     * @returns Date
     */
    handler(invoiceDateStr) {
        if (invoiceDateStr) {
            date = new Date(invoiceDateStr.replace('年', '-').replace('月', '-').replace('日', 'T00:00:00.000+0000'))
        } else {
            date = undefined // 处理 '' 空字符串的情况
        }
        return date
    }
}