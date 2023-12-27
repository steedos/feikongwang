/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-27 17:20:25
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-19 09:34:19
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/consts/index.js
 * @Description: 
 */
module.exports = {
    NEED_CONFIG_AK_AND_SK: '请配置环境变量STEEDOS_LABS_INVOICE_BAIDU_AK、STEEDOS_LABS_INVOICE_BAIDU_SK，以使用发票识别、验真功能。',
    IMAGE_MIMETYPES: ['image/png', 'image/jpeg', 'image/bmp'], // 图片类型
    PDF_MIMETYPES: ['application/pdf'], // pdf类型
    INVOICE_OCR_URL: 'https://aip.baidubce.com/rest/2.0/ocr/v1/multiple_invoice', // ocr识别地址
    INVOICE_VERIFY_URL: 'https://aip.baidubce.com/rest/2.0/ocr/v1/vat_invoice_verification', // 发票查验地址
    VAT_INVOICE_TYPE_MAP_FOR_VERIFICATION: { // 识别接口中的增值税发票的细分类型与增值税发票验真接口参数发票种类对照关系，用于发票验真接口
        "普通发票": "normal_invoice", // 增值税普通发票
        "专用发票": "special_vat_invoice", // 增值税专用发票
        "电子普通发票": "elec_normal_invoice", // 增值税普通发票（电子）
        "增值税普通发票（卷式）": "roll_normal_invoice",
        "电子专用发票": "elec_special_vat_invoice", // 增值税电子专用发票
        "通行费电子普票": "toll_elec_normal_invoice", // 通行费增值税电子普通发票
        "区块链发票": "blockchain_invoice", // 区块链电子发票（目前仅支持深圳地区）
        "电子发票(专用发票)": "elec_invoice_special", // 全电发票（专用发票）
        "电子发票(普通发票)": "elec_invoice_normal", // 全电发票（普通发票）
        "货运运输业增值税专用发票": "special_freight_transport_invoice",
        "机动车销售发票": "motor_vehicle_invoice",
        "二手车销售发票": "used_vehicle_invoice",
    },
    VAT_INVOICE_VERIFICATION_NOTAX_TYPES: [
        "special_vat_invoice",               // 增值税专用发票
        "elec_special_vat_invoice",          // 增值税电子专用发票
        "blockchain_invoice",                // 区块链电子发票（目前仅支持深圳地区）
        "motor_vehicle_invoice",             // 机动车销售发票
        "special_freight_transport_invoice", // 货运运输业增值税专用发票
    ], // 增值税专票、电子专票、区块链电子发票、机动车销售发票、货运专票填写不含税金额
    INVOICE_VERIFY_PASS_CODE: '0001',
}