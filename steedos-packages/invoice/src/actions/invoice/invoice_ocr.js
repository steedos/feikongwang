/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-26 16:22:52
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-11-02 16:12:08
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/actions/invoice/invoice_ocr.js
 * @Description: 识别发票文件，生成发票台账
 */
"use strict";

const _ = require('lodash')
const { INVOICE_OCR_URL } = require('../../consts')

module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/invoice/ocr'
    },
    params: {
        file: { type: 'string' }, // 文件内容，示例："data:image/jpeg;base64,/9j/4AAQSkZJRgABAQA....."
        filename: { type: 'string' }, // 文件名
        recordId: { type: 'string' }, //关联主表id
        objectName: { type: 'string' }
    },
    async handler(ctx) {
        const userSession = ctx.meta.user
        const { spaceId, userId } = userSession
        const { file: fileBase64, filename, recordId, objectName } = ctx.params
        const fileInfo = this.getFileInfoFromBase64(fileBase64)
        const mimetype = fileInfo.mime
        const fileData = fileInfo.data

        const invoiceObj = this.getObject('invoices')
        const invoiceLogObj = this.getObject('invoices_ocr_logs')
        let insertedInvoiceCount = 0 // 成功录入发票数
        let existedInvoiceNums = [] // 已存在的发票发票号码

        // 调用百度发票识别
        const form = this.getOcrForm(fileData, mimetype)
        const ocrResult = await this.httpClientPost(INVOICE_OCR_URL, form);
        // 临时使用此数据调试，避免消耗免费识别次数
        // 增值税专票
        // const ocrResult = { "words_result": [{ "result": { "AmountInWords": [{ "word": "贰佰伍拾伍圆整" }], "InvoiceNumConfirm": [{ "word": "23312000000065868597" }], "CommodityEndDate": [], "CommodityStartDate": [], "CommodityVehicleType": [], "CommodityPrice": [{ "row": "1", "word": "252.475247524752" }], "InvoiceTag": [{ "word": "其他" }], "NoteDrawer": [{ "word": "伏立浩" }], "SellerAddress": [], "CommodityNum": [{ "row": "1", "word": "1" }], "SellerRegisterNum": [{ "word": "91310117755703548F" }], "Remarks": [], "SellerBank": [], "MachineCode": [], "CommodityTaxRate": [{ "row": "1", "word": "1%" }], "ServiceType": [{ "word": "服务" }], "TotalTax": [{ "word": "2.52" }], "InvoiceCodeConfirm": [], "CheckCode": [], "InvoiceCode": [], "InvoiceDate": [{ "word": "2023年08月29日" }], "PurchaserRegisterNum": [{ "word": "91310112703255042R" }], "InvoiceTypeOrg": [{ "word": "电子发票(增值税专用发票)" }], "Password": [], "OnlinePay": [], "Agent": [{ "word": "否" }], "AmountInFiguers": [{ "word": "255.00" }], "PurchaserBank": [], "Checker": [], "City": [], "TotalAmount": [{ "word": "252.48" }], "CommodityAmount": [{ "row": "1", "word": "252.48" }], "PurchaserName": [{ "word": "上海华炎软件科技有限公司" }], "CommodityType": [], "Province": [], "InvoiceType": [{ "word": "电子发票(专用发票)" }], "SheetNum": [], "PurchaserAddress": [], "InvoiceNumDigit": [], "CommodityTax": [{ "row": "1", "word": "2.52" }], "CommodityPlateNum": [], "CommodityUnit": [{ "row": "1", "word": "天" }], "Payee": [], "CommodityName": [{ "row": "1", "word": "*住宿服务*住宿服务" }], "SellerName": [{ "word": "称:上海江山宾馆" }], "InvoiceNum": [{ "word": "23312000000065868597" }] }, "top": 0, "left": 0, "probability": 0.5753561258, "width": 824, "type": "vat_invoice", "height": 548 }], "words_result_num": 1, "pdf_file_size": 1, "log_id": 1710482845914832290 };
        // 火车、过路费、出租车
        // const ocrResult = { "words_result": [{ "result": { "date": [{ "word": "2023年08月28日" }], "starting_station": [{ "word": "盐城站" }], "Waiting_area": [{ "word": "检票:3B4B" }], "ticket_num": [{ "word": "L088034" }], "train_num": [{ "word": "G1531" }], "ticket_rates": [{ "word": "￥148.0元" }], "serial_number": [{ "word": "18968301640829L088034" }], "ID_card": [{ "word": "3209231986****0919" }], "seat_category": [{ "word": "二等座" }], "ServiceType": [{ "word": "交通" }], "destination_station": [{ "word": "上海虹桥站" }], "name": [{ "word": "孙浩林" }], "sales_station": [{ "word": "1M" }], "time": [{ "word": "17:32" }], "seat_num": [{ "word": "07车06F号" }] }, "top": 268, "left": 8, "probability": 0.9087857604, "width": 422, "type": "train_ticket", "height": 251 }, { "result": { "Entrance": [{ "word": "上海嘉闵高架站申" }], "ServiceType": [{ "word": "交通" }], "OutTime": [{ "word": "" }], "InvoiceCode": [{ "word": "131002260507" }], "OutDate": [{ "word": "" }], "City": [{ "word": "" }], "TotalAmount": [{ "word": "" }], "Province": [{ "word": "上海" }], "Exit": [{ "word": "上海昆阳路站" }], "InvoiceNum": [{ "word": "83374560" }] }, "top": 225, "left": 397, "probability": 0.7748835683, "width": 464, "type": "toll_invoice", "height": 651 }, { "result": { "PickupTime": [{ "word": "19:54" }], "DropoffTime": [{ "word": "20:23" }], "Time": [{ "word": "19:54-20:23" }], "City": [{ "word": "" }], "FuelOilSurcharge": [{ "word": "0.00" }], "Date": [{ "word": "223-08-28" }], "Province": [{ "word": "上海" }], "CallServiceSurcharge": [{ "word": "0.00" }], "Fare": [{ "word": "48.00" }], "TotalFare": [{ "word": "48.00" }], "TaxiNum": [{ "word": "ADW7871" }], "ServiceType": [{ "word": "交通" }], "PricePerkm": [{ "word": "2.70" }], "InvoiceCode": [{ "word": "131002360126" }], "Distance": [{ "word": "11.7" }], "InvoiceNum": [{ "word": "01684004" }], "Location": [{ "word": "上海" }] }, "top": 261, "left": 868, "probability": 0.9683366418, "width": 231, "type": "taxi_receipt", "height": 586 }, { "result": { "PickupTime": [{ "word": "20:37" }], "DropoffTime": [{ "word": "20:51" }], "Time": [{ "word": "20:37-20:51" }], "City": [{ "word": "盐城市" }], "FuelOilSurcharge": [{ "word": "0.00" }], "Date": [{ "word": "2023-09-15" }], "Province": [{ "word": "江苏省" }], "CallServiceSurcharge": [{ "word": "0.00" }], "Fare": [{ "word": "32.00" }], "TotalFare": [{ "word": "32.00" }], "TaxiNum": [{ "word": "JD38173" }], "ServiceType": [{ "word": "交通" }], "PricePerkm": [{ "word": "3.15" }], "InvoiceCode": [{ "word": "132092181210" }], "Distance": [{ "word": "11.0" }], "InvoiceNum": [{ "word": "06598268" }], "Location": [{ "word": "江苏省盐城市" }] }, "top": 275, "left": 1096, "probability": 0.9303298593, "width": 225, "type": "taxi_receipt", "height": 608 }, { "result": { "PickupTime": [{ "word": "14:57" }], "DropoffTime": [{ "word": "15:30" }], "Time": [{ "word": "14:57-15:30" }], "City": [{ "word": "" }], "FuelOilSurcharge": [{ "word": "0.00" }], "Date": [{ "word": "23-09-15" }], "Province": [{ "word": "上海" }], "CallServiceSurcharge": [{ "word": "0.00" }], "Fare": [{ "word": "76.00" }], "TotalFare": [{ "word": "76.00" }], "TaxiNum": [{ "word": "ADS7050" }], "ServiceType": [{ "word": "交通" }], "PricePerkm": [{ "word": "4.10" }], "InvoiceCode": [{ "word": "131002360504" }], "Distance": [{ "word": "19.9" }], "InvoiceNum": [{ "word": "07715499" }], "Location": [{ "word": "上海" }] }, "top": 282, "left": 1303, "probability": 0.8219360709, "width": 227, "type": "taxi_receipt", "height": 586 }, { "result": { "date": [{ "word": "2023年09月15日" }], "starting_station": [{ "word": "上海虹桥站" }], "Waiting_area": [{ "word": "检票:26AB" }], "ticket_num": [{ "word": "Z123E002184" }], "train_num": [{ "word": "G8362" }], "ticket_rates": [{ "word": "￥140.0元" }], "serial_number": [{ "word": "66100311230916E002184" }], "ID_card": [{ "word": "3209231986****0919" }], "seat_category": [{ "word": "二等座" }], "ServiceType": [{ "word": "交通" }], "destination_station": [{ "word": "盐城站" }], "name": [{ "word": "孙浩林" }], "sales_station": [{ "word": "JM" }], "time": [{ "word": "18:13" }], "seat_num": [{ "word": "07车12F号" }] }, "top": 574, "left": 0, "probability": 0.9373725057, "width": 432, "type": "train_ticket", "height": 266 }, { "result": { "PickupTime": [{ "word": "16:38" }], "DropoffTime": [{ "word": "16:56" }], "Time": [{ "word": "16:38-16:56" }], "City": [{ "word": "盐城市" }], "FuelOilSurcharge": [{ "word": "0.00" }], "Date": [{ "word": "2023-08-28" }], "Province": [{ "word": "江苏省" }], "CallServiceSurcharge": [{ "word": "0.00" }], "Fare": [{ "word": "91.00" }], "TotalFare": [{ "word": "91.00" }], "TaxiNum": [{ "word": "TD06817" }], "ServiceType": [{ "word": "交通" }], "PricePerkm": [{ "word": "3.15" }], "InvoiceCode": [{ "word": "132092381210" }], "Distance": [{ "word": "12.3" }], "InvoiceNum": [{ "word": "02534247" }], "Location": [{ "word": "江苏省盐城市" }] }, "top": 331, "left": 1544, "probability": 0.9071161151, "width": 229, "type": "taxi_receipt", "height": 564 }], "words_result_num": 7, "log_id": "1712287929644667136" }
        // 定额
        // const ocrResult = { "words_result": [ { "result": { "invoice_code": [ { "word": "131001862001" } ], "ServiceType": [ { "word": "交通" } ], "invoice_rate": [ { "word": "壹佰元" } ], "invoice_rate_in_figure": [ { "word": "100.00" } ], "invoice_type": [ { "word": "上海公共交通卡股份有限公司" } ], "City": [ { "word": "" } ], "invoice_number": [ { "word": "18216607" } ], "invoice_rate_in_word": [ { "word": "壹佰元" } ], "Province": [ { "word": "上海" } ], "Location": [ { "word": "上海" } ] }, "top": 334, "left": 109, "probability": 0.8969449997, "width": 913, "type": "quota_invoice", "height": 577 }, { "result": { "invoice_code": [ { "word": "131001761001" } ], "ServiceType": [ { "word": "交通" } ], "invoice_rate": [ { "word": "壹佰元" } ], "invoice_rate_in_figure": [ { "word": "100.00" } ], "invoice_type": [ { "word": "上海公共交通卡股份有限公司" } ], "City": [ { "word": "" } ], "invoice_number": [ { "word": "06453238" } ], "invoice_rate_in_word": [ { "word": "壹佰元" } ], "Province": [ { "word": "上海" } ], "Location": [ { "word": "上海" } ] }, "top": 909, "left": 57, "probability": 0.9190372229, "width": 956, "type": "quota_invoice", "height": 641 } ], "words_result_num": 2, "log_id": "1712352444487380106" }
        // 飞机票
        // const ocrResult = { "words_result": [ { "result": { "allow": [ { "word": "20K" } ], "date": [ { "word": "2023-05-03" } ], "insurance": [ { "word": "XXX" } ], "fare": [ { "word": "800.00" } ], "flight": [ { "word": "MU9078" } ], "starting_station": [ { "word": "揭阳" } ], "endorsement": [ { "word": "改期退票收费" } ], "expiration_date": [], "id_no": [ { "word": "310103198009082422" } ], "ServiceType": [ { "word": "交通" } ], "fare_basis": [ { "word": "Y" } ], "effective_date": [], "agent_code": [ { "word": "SHA16608677392" } ], "class": [ { "word": "Y" } ], "start_date": [ { "word": "2023-05-05" } ], "issued_by": [ { "word": "上海华程西南国际旅行社有限公司" } ], "ticket_rates": [ { "word": "830.00" } ], "ck": [ { "word": "3565" } ], "oil_money": [ { "word": "30.00" } ], "serial_number": [ { "word": "54200635650" } ], "ticket_number": [ { "word": "7812436749275" } ], "carrier": [ { "word": "东航" } ], "other_tax": [ { "word": "CNY" } ], "destination_station": [ { "word": "温州" } ], "name": [ { "word": "黄怡" } ], "time": [ { "word": "11:25" } ], "dev_fund": [ { "word": "EXEMPT" } ] }, "top": 137, "left": 13, "probability": 0.9323611856, "width": 1905, "type": "air_ticket", "height": 937 } ], "words_result_num": 1, "log_id": "1712356330022910318" }
        // TODO 网约车行程单 没有发票号码
        // const ocrResult = {"words_result":[{"result":{"start_time":[{"word":"2023-09-30 --:--"}],"phone":[{"word":"13564674539"}],"ServiceType":[{"word":"交通"}],"destination_time":[{"word":"2023-10-05 --:--"}],"total_fare":[{"word":""}],"application_date":[{"word":""}],"service_provider":[{"word":"美团打车"}],"items":[{"fare":{"word":"300.18"},"pickup_date":{"word":"2023-09-30"},"distance":{"word":"46.8"},"destination_place":{"word":"上海浦东国际机场-T1航站楼"},"city":{"word":"卜亚"},"item_id":{"word":"1"},"item_provider":{"word":""},"start_place":{"word":"新时代花园-西北门"},"pickup_time":{"word":":"},"car_type":{"word":"首汽六座商务1"}},{"fare":{"word":"42.27"},"pickup_date":{"word":"2023-10-05"},"distance":{"word":"183"},"destination_place":{"word":"南禅寺步行街"},"city":{"word":"无锡"},"item_id":{"word":"2"},"item_provider":{"word":""},"start_place":{"word":"T2国内停车场网约车上客点"},"pickup_time":{"word":":"},"car_type":{"word":"首汽畅享型"}},{"fare":{"word":"119.56"},"pickup_date":{"word":"2023-10-05"},"distance":{"word":"13.3"},"destination_place":{"word":"新时代花园-西北门"},"city":{"word":"上海"},"item_id":{"word":"3"},"item_provider":{"word":""},"start_place":{"word":"绍虹路与申虹路交叉口东南侧"},"pickup_time":{"word":":"},"car_type":{"word":"首汽六座商务"}}],"item_num":[{"word":"3"}]},"top":413,"left":52,"probability":0.5444153547,"width":716,"type":"taxi_online_ticket","height":490}],"words_result_num":1,"pdf_file_size":1,"log_id":1712373885425567491}
        // 卷票

        // 机打发票

        // 汽车票

        // 船票

        // 机动车销售发票

        // 二手车发票

        // 其他 others
        // {"words_result":[{"top":7,"left":6,"probability":0.5870223641,"width":813,"type":"others","height":1152}],"words_result_num":1,"pdf_file_size":2,"log_id":1713815392616467227}

        // 进日志
        const logDoc = await invoiceLogObj.insert({
            ...ocrResult,
        }, userSession)

        // const ocrResult = {"log_id":1714116698657906939,"error_msg":"input oversize","error_code":216205}
        if (ocrResult.error_code) {
            console.error(ocrResult)
            return {
                "status": -1,
                "msg": ocrResult.error_msg,
                "data": {}
            }
        }

        // 新增发票台账信息，上传发票文件作为发票台账字段
        if (ocrResult.words_result) {
            for (const item of ocrResult.words_result) {

                const doc = this.getInvoiceInsertDoc(item)

                if (!_.isEmpty(doc)) {

                    // 查重
                    const isExists = await this.isInvoiceExists(spaceId, doc.invoice_code, doc.invoice_num)
                    if (isExists) {
                        existedInvoiceNums.push(doc.invoice_num)
                        continue
                    }

                    // 上传发票文件
                    const fileDoc = await this.uploadInvoiceFile(filename, fileData, userId)

                    if (!_.isEmpty(fileDoc)) {
                        var newDoc = ""
                        // 新增发票台账
                        if (objectName && objectName == "purchase_orders") {
                            // 判断该recordId，是应付合同的id还是报销单的id
                            newDoc = await invoiceObj.insert({
                                ...doc,
                                file: fileDoc._id,
                                ocr_log: logDoc._id,
                                ocr_result: item.result,
                                purchase_order: recordId ? recordId : null

                            }, userSession)

                        } else if (objectName && objectName == "expense_reports") {
                            newDoc = await invoiceObj.insert({
                                ...doc,
                                file: fileDoc._id,
                                ocr_log: logDoc._id,
                                ocr_result: item.result,
                                expense_reports: recordId ? recordId : null

                            }, userSession)
                        } else {
                            newDoc = await invoiceObj.insert({
                                ...doc,
                                file: fileDoc._id,
                                ocr_log: logDoc._id,
                                ocr_result: item.result

                            }, userSession)
                        }

                        insertedInvoiceCount++

                        // 如果是增值税发票则执行 验真，并记录验真结果
                        if ('vat_invoice' === doc.type) {
                            const verifyResult = await ctx.call('@steedos-labs/invoice.invoice_verify', {
                                invoiceId: newDoc._id
                            })
                            if (-1 == verifyResult.status) {
                                return {
                                    "status": -1,
                                    "msg": '',
                                    "data": verifyResult
                                }
                            }
                        }

                    }
                }
            }
        }

        let msg = `成功录入${insertedInvoiceCount}张发票`

        if (!_.isEmpty(existedInvoiceNums)) {
            msg += `，发票号为${existedInvoiceNums.join(',')}的发票已存在于发票台账，不可重复导入。`
        }

        return {
            "status": 0,
            "msg": msg,
            "data": {}
        }

    }
}


