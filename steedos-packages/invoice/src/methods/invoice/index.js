/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-27 14:45:13
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-31 17:53:38
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/index.js
 * @Description: 
 */
module.exports = {
    convertAmountStrToNum: require('./convertAmountStrToNum'),
    convertInvoiceDateStrToDate: require('./convertInvoiceDateStrToDate'),
    getAccessToken: require('./getAccessToken'),
    getFileInfoFromBase64: require('./getFileInfoFromBase64'),
    getInvoiceInsertDoc: require('./getInvoiceInsertDoc'),
    getOcrForm: require('./getOcrForm'),
    getVerifyForm: require('./getVerifyForm'),
    httpClientPost: require('./httpClientPost'),
    isImage: require('./isImage'),
    isInvoiceExists: require('./isInvoiceExists'),
    isPdf: require('./isPdf'),
    unlinkInvoiceFile: require('./unlinkInvoiceFile'),
    uploadInvoiceFile: require('./uploadInvoiceFile')
}