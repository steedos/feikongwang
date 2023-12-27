/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-08 13:22:39
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-17 11:06:43
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/getVerifyForm.js
 * @Description: 从发票台账中提取增值税发票验真6要素信息
 */
"use strict";
// @ts-check
const moment = require('moment')
const { VAT_INVOICE_TYPE_MAP_FOR_VERIFICATION, VAT_INVOICE_VERIFICATION_NOTAX_TYPES } = require('../../consts')

/**
 * @param object invoiceDoc 发票台账
 * @returns object 增值税发票验真6要素
 */
module.exports = {
    handler(invoiceDoc) {
        const invoice_date = moment(invoiceDoc.invoice_date).format('YYYYMMDD')
        const invoice_type = VAT_INVOICE_TYPE_MAP_FOR_VERIFICATION[invoiceDoc.invoice_type]
        const check_code = invoiceDoc.check_code ? invoiceDoc.check_code.substring(invoiceDoc.check_code.length - 6) : ''
        let total_amount = invoiceDoc.invoice_amount ? invoiceDoc.invoice_amount + '' : ''

        // 增值税专票、电子专票、区块链电子发票、机动车销售发票、货运专票填写不含税金额
        if (VAT_INVOICE_VERIFICATION_NOTAX_TYPES.includes(invoice_type)) {
            total_amount = invoiceDoc.notax_amount ? invoiceDoc.notax_amount + '' : ''
        }

        const form = {
            'invoice_code': invoiceDoc.invoice_code || '', // 发票代码。全电发票（专用发票）、全电发票（普通发票）此参数可为空，其他类型发票均不可为空
            'invoice_num': invoiceDoc.invoice_num, // 发票号码
            'invoice_date': invoice_date, // 开票日期。格式YYYYMMDD，例：20210101
            'invoice_type': invoice_type, // 发票种类
            'check_code': check_code, // 校验码。填写发票校验码后6位。增值税电子专票、普票、电子普票、卷票、区块链电子发票、通行费增值税电子普通发票此参数必填；其他类型发票此参数可为空
            'total_amount': total_amount, // 发票金额。增值税专票、电子专票、区块链电子发票、机动车销售发票、货运专票填写不含税金额；二手车销售发票填写车价合计；全电发票（专用发票）、全电发票（普通发票）填写价税合计金额，其他类型发票可为空
        }
        return form;
    }
}