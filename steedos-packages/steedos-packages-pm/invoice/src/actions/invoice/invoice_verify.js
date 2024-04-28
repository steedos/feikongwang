/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-08 09:56:31
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-18 13:49:24
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/actions/invoice/invoice_verify.js
 * @Description: 发票验真
 */
"use strict";
// @ts-check

const { INVOICE_VERIFY_URL, INVOICE_VERIFY_PASS_CODE } = require('../../consts')

module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/invoice/verify'
    },
    params: {
        invoiceId: { // 发票台账ID
            type: 'string',
        }
    },
    async handler(ctx) {
        const userSession = ctx.meta.user
        const { invoiceId } = ctx.params
        // console.log('invoiceId:', invoiceId)
        const invoicesObj = this.getObject('invoices')
        const invoicesVerifyLogObj = this.getObject('invoices_verify_logs')

        const doc = await invoicesObj.findOne(invoiceId)

        if ('vat_invoice' !== doc.type) {
            return {
                "status": 0,
                "msg": '请确认发票类型为增值税发票',
                "data": {}
            }
        }

        // 验真
        const verifyForm = await this.getVerifyForm(doc)
        console.log(verifyForm)
        const verifyResult = await this.httpClientPost(INVOICE_VERIFY_URL, verifyForm)
        // console.log(verifyResult)
        // 临时使用此数据调试，避免消耗免费次数
        // const verifyResult = { "VerifyFrequency": "5", "words_result": { "CommodityAmount": [{ "word": "252.48", "row": "1" }], "CarrierCode": "", "CommodityNum": [{ "word": "1", "row": "1" }], "ListLabel": "N", "SenderCode": "", "Carrier": "", "VehicleTypeNum": "", "TaxControlNum": "", "PurchaserRegisterNum": "91310112703255042R", "TotalTax": "2.52", "CommodityVehicleType": [{ "row": "1", "word": "" }], "CommodityTaxRate": [{ "row": "1", "word": "1%" }], "SellerAddress": "上海市松江区九亭镇西大街1218号 57634200", "CommodityEndDate": [{ "word": "", "row": "1" }], "CommodityPrice": [{ "row": "1", "word": "252.475247524752" }], "Checker": "", "CommodityType": [{ "row": "1", "word": "" }], "Receiver": "", "CommodityExpenseItem": [{ "row": "1", "word": "" }], "RecipientCode": "", "PurchaserName": "上海华炎软件科技有限公司", "Sender": "", "SellerRegisterNum": "91310117755703548F", "TransportCargoInformation": "", "CommodityPlateNum": [{ "row": "1", "word": "" }], "TotalAmount": "252.48", "SellerBank": "中国农业银行股份有限公司上海九亭支行 03854700040018497", "PurchaserAddress": "", "Payee": "", "Remarks": "", "CommodityName": [{ "word": "*住宿服务*住宿服务", "row": "1" }], "AmountInFiguers": "255.00", "NoteDrawer": "", "DepartureViaArrival": "", "TollSign": "", "Recipient": "", "ESVATURL": "", "VehicleTonnage": "", "PurchaserBank": "", "ReceiverCode": "", "CommodityUnit": [{ "word": "天", "row": "1" }], "CommodityStartDate": [{ "row": "1", "word": "" }], "CommodityTax": [{ "row": "1", "word": "2.52" }], "SellerName": "上海江山宾馆", "ZeroTaxRateIndicator": "" }, "MachineCode": "", "InvoiceNum": "23312000000065868597", "InvoiceDate": "20230829", "VerifyResult": "0001", "InvalidSign": "N", "InvoiceCode": "", "InvoiceType": "全电发票（专用发票）", "words_result_num": 45, "CheckCode": "23312000000065868597", "VerifyMessage": "查验成功发票一致", "log_id": 1711943098298576227 }

        // 录入验真日志
        const logDoc = await invoicesVerifyLogObj.insert({
            "verify_frequency": verifyResult.VerifyFrequency,
            "machine_code": verifyResult.MachineCode,
            "invoice_num": verifyResult.InvoiceNum,
            "invoice_date": verifyResult.InvoiceDate,
            "verify_result": verifyResult.VerifyResult,
            "invalid_sign": verifyResult.InvalidSign,
            "invoice_code": verifyResult.InvoiceCode,
            "invoice_type": verifyResult.InvoiceType,
            "words_result_num": verifyResult.words_result_num,
            "words_result": verifyResult.words_result,
            "check_code": verifyResult.CheckCode,
            "verify_message": verifyResult.VerifyMessage,
            "log_id": verifyResult.log_id,
            "error_code": verifyResult.error_code,
            "error_msg": verifyResult.error_msg,
        }, userSession)

        // const verifyResult = { error_code: 18, error_msg: 'Open api qps request limit reached' } // 达到每秒验真上限，或未开通发票验真功能，或欠费
        if (verifyResult.error_code) {
            console.error(verifyResult)
            return {
                "status": -1,
                "msg": verifyResult.error_msg,
                "data": {}
            }
        }

        // 查验状态
        const verifyStatus = INVOICE_VERIFY_PASS_CODE === verifyResult.VerifyResult ? 'passed' : 'failed'
        // 已查验通过的发票不可编辑
        const locked = 'passed' === verifyStatus ? true : false

        // 更新发票
        await invoicesObj.update(invoiceId, {
            "verify_log": logDoc._id,
            "verify_result": verifyResult.VerifyResult,
            "verify_message": verifyResult.VerifyMessage,
            "invalid_sign": verifyResult.InvalidSign,
            "verify_status": verifyStatus,
            "locked": locked,
        }, userSession)

        const msg = verifyResult.VerifyMessage
        return {
            "status": 0,
            "msg": msg,
            "data": {}
        }

    }
}