/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-09-28 17:49:02
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-31 16:05:16
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/getInvoiceInsertDoc.js
 * @Description: 使用识别出的发票结果生成发票台账内容
 */
const _ =require('lodash')

module.exports = {
    handler(wordsResultItem) {
        const { result, type } = wordsResultItem
        let doc = {}
        if (result) {
            switch (type) {
                case 'vat_invoice': // 增值税发票
                    doc = {
                        service_type: result.ServiceType[0].word,                    // 发票消费类型。不同消费类型输出：餐饮、电器设备、通讯、服务、日用品食品、医疗、交通、其他
                        // InvoiceTypeOrg 发票名称
                        invoice_type: result.InvoiceType[0].word,                    // InvoiceType 增值税发票的细分类型。 不同细分类型的发票输出：普通发票、专用发票、电子普通发票、电子专用发票、通行费电子普票、区块链发票、通用机打电子发票、电子发票(专用发票)、电子发票(普通发票)
                        // InvoiceTag 增值税发票左上角标志。 包含：通行费、销项负数、代开、收购、成品油、其他
                        invoice_code: result.InvoiceCode[0]?.word,                   // 发票代码
                        invoice_num: result.InvoiceNum[0].word,                      // 发票号码
                        // InvoiceCodeConfirm 发票代码的辅助校验码，一般业务情景可忽略
                        // InvoiceNumConfirm 发票号码的辅助校验码，一般业务情景可忽略
                        check_code: result.CheckCode[0]?.word,                       // 校验码。增值税专票无此参数
                        // InvoiceNumDigit 数电票号码。密码区部分的数电票号码，仅在纸质的数电票上出现
                        invoice_date: result.InvoiceDate[0].word,                    // 开票日期
                        purchaser_name: result.PurchaserName[0].word,                // 购方名称
                        purchaser_register_num: result.PurchaserRegisterNum[0].word, // 购方纳税人识别号
                        // PurchaserAddress 购方地址及电话
                        // PurchaserBank 购方开户行及账号
                        // Password 密码区
                        // Province 省
                        // City 市
                        // SheetNum 联次信息。专票第一联到第三联分别输出：第一联：记账联、第二联：抵扣联、第三联：发票联；普通发票第一联到第二联分别输出：第一联：记账联、第二联：发票联
                        // Agent 是否代开
                        // OnlinePay 电子支付标识。仅区块链发票含有此参数
                        seller_name: result.SellerName[0].word,                      // 销售方名称
                        seller_register_num: result.SellerRegisterNum[0].word,       // 销售方纳税人识别号
                        // SellerAddress 销售方地址及电话
                        // SellerBank 销售方开户行及账号
                        notax_amount: result.TotalAmount[0].word,                    // 合计金额
                        tax_amount: result.TotalTax[0].word,                         // 合计税额
                        // AmountInWords 价税合计(大写)
                        invoice_amount: result.AmountInFiguers[0].word,              // AmountInFiguers 价税合计(小写)
                        // Payee 收款人
                        // Checker 复核
                        // NoteDrawer 开票人
                        // Remarks 备注
                        // CommodityName 货物名称
                        // CommodityType 规格型号
                        // CommodityUnit 单位
                        // CommodityNum 数量
                        // CommodityPrice 单价
                        // CommodityAmount 金额
                        // CommodityTaxRate 税率
                        // CommodityTax 税额
                        // CommodityPlateNum 车牌号。仅通行费增值税电子普通发票含有此参数
                        // CommodityVehicleType 类型。仅通行费增值税电子普通发票含有此参数
                        // CommodityStartDate  通行日期起。仅通行费增值税电子普通发票含有此参数
                        // CommodityEndDate  通行日期止。仅通行费增值税电子普通发票含有此参数
                    }
                    break;
                case 'taxi_receipt': // 出租车票
                    doc = {
                        service_type: result.ServiceType[0].word,  // 发票消费类型。出租车票此字段固定输出：交通
                        invoice_code: result.InvoiceCode[0]?.word, // 发票代号
                        invoice_num: result.InvoiceNum[0].word,    // 发票号码
                        // TaxiNum 车牌号
                        invoice_date: result.Date[0].word,         // 日期
                        // Time 上下车时间
                        // PickupTime 上车时间
                        // DropoffTime 下车时间
                        // Fare 金额
                        // FuelOilSurcharge 燃油附加费
                        // CallServiceSurcharge 叫车服务费
                        invoice_amount: result.TotalFare[0].word,  // 总金额
                        // Location 开票城市
                        // Province 省
                        // City 市
                        // PricePerkm 单价
                        // Distance 里程
                    }
                    break;
                case 'train_ticket': // 火车票
                    doc = {
                        service_type: result.ServiceType[0].word,    // 发票消费类型。火车票此字段固定输出：交通
                        invoice_num: result.ticket_num[0].word,      // 车票号
                        // starting_station 始发站
                        // train_num 车次号
                        // destination_station 到达站
                        invoice_date: result.date[0].word,           // 出发日期
                        invoice_amount: result.ticket_rates[0].word, // 车票金额
                        // seat_category 席别
                        // name 乘客姓名
                        // ID_card 身份证号
                        // serial_number 序列号
                        // sales_station 售站
                        // time 时间
                        // seat_num 座位号
                        // Waiting_area 候检区
                    }
                    break;
                case 'quota_invoice': // 定额发票
                    doc = {
                        service_type: result.ServiceType[0].word,              // 发票消费类型。定额发票此字段固定输出：交通
                        invoice_code: result.invoice_code[0]?.word,            // 发票代码
                        invoice_num: result.invoice_number[0].word,            // 发票号码
                        // invoice_rate 金额
                        invoice_amount: result.invoice_rate_in_figure[0].word, // invoice_rate_in_figure 金额小写
                        // invoice_rate_in_word 金额大写
                        // Province 省
                        // City 市
                        // Location 发票所在地
                        // invoice_type 发票名称
                    }
                    break;
                case 'air_ticket': // 飞机行程单
                    doc = {
                        service_type: result.ServiceType[0].word,    // 发票消费类型。飞机行程单此字段固定输出：交通
                        // name 姓名
                        // starting_station 始发站
                        // destination_station 目的站
                        // flight 航班号
                        invoice_date: result.date[0].word,           // 日期
                        invoice_num: result.ticket_number[0].word,   // 电子客票号码
                        // fare 票价
                        // dev_fund 民航发展基金/基建费
                        // oil_money 燃油附加费
                        // other_tax 其他税费
                        invoice_amount: result.ticket_rates[0].word, // 合计金额
                        // start_date 填开日期
                        // id_no 身份证号
                        // carrier 承运人
                        // time 时间
                        // issued_by 订票渠道
                        // serial_number 印刷序号
                        // insurance 保险费
                        // fare_basis 客票级别
                        // class 座位等级
                        // agent_code 销售单位号
                        // endorsement 签注
                        // allow 免费行李
                        // ck 验证码
                        // effective_date 客票生效日期
                        // expiration_date 有效期截止日期
                    }
                    break;
                case 'roll_normal_invoice': // 卷票
                    // TODO
                    doc = {
                        name: result.InvoiceType[0].word,                            // 发票名称
                        invoice_code: result.InvoiceCode[0]?.word,                   // 发票代码
                        invoice_num: result.InvoiceNum[0].word,                      // 发票号码
                        // MachineNum 机打号码。仅增值税卷票含有此参数
                        // MachineCode 机器编号。仅增值税卷票含有此参数
                        invoice_date: result.InvoiceDate[0].word,                    // 开票日期
                        purchaser_name: result.PurchaserName[0].word,                // 购方名称
                        purchaser_register_num: result.PurchaserRegisterNum[0].word, // 购方纳税人识别号
                        seller_name: result.SellerName[0].word,                      // 销售方名称
                        seller_register_num: result.SellerRegisterNum[0].word,       // 销售方纳税人识别号
                        invoice_amount: result.TotalTax[0].word,                     // 价税合计
                        // AmountInWords 合计金额(大写)
                        // AmountInFiguers 合计金额(小写)
                        // Payee 收款人
                        check_code: result.CheckCode[0]?.word,                       // 校验码。增值税专票无此参数
                        // Province 省
                        // City 市
                        // CommodityName 货物名称
                        // CommodityNum 数量
                        // CommodityPrice 单价
                        // CommodityAmount 金额
                    }
                    break;
                case 'printed_invoice': // 机打发票
                    // TODO
                    doc = {
                        service_type: result.ServiceType[0].word,                    // 发票消费类型。不同消费类型输出：餐饮、电器设备、通讯、服务、日用品食品、医疗、交通、其他
                        invoice_type: result.InvoiceType[0].word,                    // 发票类型
                        invoice_code: result.InvoiceCode[0]?.word,                   // 发票代码
                        invoice_num: result.InvoiceNum[0].word,                      // 发票号码
                        invoice_date: result.InvoiceDate[0].word,                    // 开票日期
                        invoice_amount: result.AmountInFiguers[0].word,              // 合计金额小写
                        // AmountInWords 合计金额大写
                        // MachineNum 机打号码
                        check_code: result.CheckCode[0]?.word,                       // 校验码
                        seller_name: result.SellerName[0].word,                      // 销售方名称
                        seller_register_num: result.SellerRegisterNum[0].word,       // 销售方纳税人识别号
                        purchaser_name: result.PurchaserName[0].word,                // 购买方名称
                        purchaser_register_num: result.PurchaserRegisterNum[0].word, // 购买方纳税人识别号
                        tax_amount: result.TotalTax[0].word,                         // 合计税额
                        // Province 省
                        // City 市
                        // Time 时间
                        // SheetNum 联次
                        // CommodityName 商品名称
                        // CommodityUnit 商品单位
                        // CommodityPrice 商品单价
                        // CommodityNum 商品数量
                        // CommodityAmount 商品金额
                    }
                    break;
                case 'bus_ticket': // 汽车票
                    // TODO
                    doc = {
                        service_type: result.ServiceType[0].word,  // 发票消费类型。汽车票此字段固定输出：交通
                        invoice_code: result.InvoiceCode[0]?.word, // 发票代码
                        invoice_num: result.InvoiceNum[0].word,    // 发票号码
                        // Date 日期
                        // Time 时间
                        // ExitStation 出发站
                        invoice_amount: result.Amount[0].word,     // Amount 金额
                        // IdCard 身份证号
                        // ArrivalStation 到达站
                        // Name 姓名
                        invoice_date: result.InvoiceTime[0].word,  // InvoiceTime 开票日期
                    }
                    break;
                case 'toll_invoice': // 过路过桥费发票
                    doc = {
                        service_type: result.ServiceType[0].word,   // ServiceType 发票消费类型。过路过桥费此字段固定输出：交通
                        invoice_code: result.InvoiceCode[0]?.word,  // InvoiceCode 发票代码
                        invoice_num: result.InvoiceNum[0].word,     // InvoiceNum 发票号码
                        // Entrance 入口
                        // Exit 出口
                        invoice_date: result.OutDate[0].word,       // OutDate 日期
                        // OutTime 时间
                        invoice_amount: result.TotalAmount[0].word, // TotalAmount 金额
                        // Province 省
                        // City 市
                    }
                    break;
                case 'ferry_ticket': // 船票
                    // TODO
                    doc = {
                        service_type: result.ServiceType[0].word,   // ServiceType 发票消费类型。船票此字段固定输出：交通
                        invoice_type: result.InvoiceType[0].word,   // InvoiceType 发票类型
                        invoice_code: result.InvoiceCode[0]?.word,  // InvoiceCode 发票代码
                        invoice_num: result.InvoiceNum[0].word,     // InvoiceNum 发票号码
                        // ExitStation 出发地点
                        // ArrivalStation 到达地点
                        invoice_amount: result.TotalAmount[0].word, // Amount 总金额
                        invoice_date: result.Date[0].word,          // Date 开票日期
                        // MoneyType 金额类型
                        // BarCode 条码
                        // BarCodeNum 条码编号
                        // City 市
                        // Province 省
                        // InvoiceTitle 发票抬头，这里指该张船票的运行公司名
                        // QrCode 二维码
                        // Time 出发时间
                        // TicketTime 制票时间
                        // TicketDate 制票日期
                        // PassengerName 乘客姓名
                        // IdCard 乘客身份证号
                    }
                    break;
                case 'motor_vehicle_invoice': // 机动车销售发票
                    // TODO
                    doc = {
                        invoice_date: result.date[0].word,                    // date 开票日期
                        invoice_code: result["fapiao-daima"][0]?.word,        // fapiao-daima 发票代码/机打代码
                        invoice_num: result["fapiao-haoma"][0].word,          // fapiao-haoma 发票号码/机打号码
                        // printed-daima 机打代码
                        // printed-haoma 机打号码
                        // machine-num 机器编号
                        purchaser_name: result["buyer-name"][0].word,         // buyer-name 购买方名称
                        // payer-tax-num 购买方身份证号码/组织机构代码
                        // car-class 车辆类型
                        // car-model 厂牌型号
                        // product-location 产地
                        // certificate-num 合格证号
                        // engine-num 发动机号码
                        // vin-num 车架号码
                        // price-tax-big 价税合计
                        invoice_amount: result["price-tax-small"][0].word,    // price-tax-small 价税合计小写
                        seller_name: result.saler[0].word,                    // saler 销货单位名称
                        // saler-phone 销货单位电话
                        seller_register_num: result["saler-tax-num"][0].word, // saler-tax-num 销货单位纳税人识别号
                        // saler-bank-num 销货单位账号
                        // saler-address 销货单位地址
                        // saler-bank 销货单位开户银行
                        // tax-rate 税率
                        tax_amount: result.tax[0].word,                       // tax 税额
                        // tax-jiguan 主管税务机关
                        // tax-jiguan-daima 主管税务机关代码
                        notax_amount: result.price[0].word,                   // price 不含税价格
                        // limit-mount 限乘人数
                        // toonage 吨位
                        // sheet-num 联次
                        // drawer 开票人
                        // remarks 备注
                        // import-certificate-num 进口证明书号
                        // tax-payment-voucher-no 完整凭税编号
                        // inspection-form-num 商检单号
                    }
                    break;
                case 'used_vehicle_invoice': // 二手车发票
                    // TODO
                    doc = {
                        invoice_code: result.invoice_code[0]?.word,  // invoice_code 发票代码
                        invoice_num: result.invoice_num[0].word,     // invoice_num 发票号码
                        invoice_date: result.date[0].word,           // date 开票日期
                        // tax_code 税控码
                        purchaser_name: result.buyer[0].word,        // buyer 买方
                        // buyer_id 买方身份证号
                        // buyer_station 买方地址
                        // buyer_tel 买方电话
                        seller_name: result.saler[0].word,           // saler 卖方
                        // saler_id 卖方身份证号
                        // saler_station 卖方地址
                        // saler_tel 卖方电话
                        // car_plate 车牌号
                        // car_certificate 登记证号
                        // car_class 车辆类型
                        // vin_num 车架号
                        // model 厂牌型号
                        // to_station 转入地车管所名称
                        // big_price 车价合计大写
                        invoice_amount: result.small_price[0].word,  // small_price 车价合计小写
                        // car_market  二手车市场
                        seller_register_num: result.tax_num[0].word, // tax_num 纳税人识别号
                        // tax_location 纳税人地址
                        // tax_tel 纳税人电话
                        // sheet_num 联次
                    }
                    break;
                case 'taxi_online_ticket': // 网约车行程单
                    // TODO
                    doc = {
                        service_type: result.ServiceType[0].word,     // ServiceType 发票消费类型。网约车行程单此字段固定输出：交通
                        seller_name: result.service_provider[0].word, // service_provider 服务商
                        // start_time 行程开始时间
                        // destination_time 行程结束时间
                        // phone 行程人手机号
                        // application_date 申请日期
                        invoice_amount: result.total_fare[0].word,    // total_fare 总金额
                        // item_num 行程信息中包含的行程数量
                        // items 行程信息
                        // item_id 行程信息的对应序号
                        // item_provider 行程信息的对应服务商
                        // pickup_time  上车时间
                        // pickup_date 上车日期
                        // car_type 车型
                        // distanc e里程
                        // start_place 起点
                        // destination_place 终点
                        // city 城市
                        // fare 金额
                    }
                    break;
                case 'limit_invoice': // 限额发票
                    // TODO 官网文档缺失
                    doc = {

                    }
                    break;
                case 'shopping_receipt': // 购物小票
                    // TODO 官网文档缺失
                    doc = {

                    }
                    break;
                case 'pos_invoice': // POS小票
                    // TODO 官网文档缺失
                    doc = {

                    }
                    break;
                case 'others': // 其他
                    // {"words_result":[{"top":7,"left":6,"probability":0.5870223641,"width":813,"type":"others","height":1152}],"words_result_num":1,"pdf_file_size":2,"log_id":1713815392616467227}
                    // TODO 官网文档缺失
                    break;
                default:
                    break;
            }

            if (!_.isEmpty(doc)) {
                doc.type = type // 发票类型
                /**
                    {
                        type: 'vat_invoice',
                        service_type: '服务',
                        invoice_code: undefined,
                        invoice_num: '23312000000065868597',
                        check_code: undefined,
                        invoice_date: '2023年08月29日',
                        purchaser_name: '上海华炎软件科技有限公司',
                        purchaser_register_num: '91310112703255042R',
                        seller_name: '称:上海江山宾馆',
                        seller_register_num: '91310117755703548F',
                        notax_amount: '252.48',
                        tax_amount: '2.52',
                        invoice_amount: '255',
                    }
                */
                // 转化 invoice_date notax_amount tax_amount invoice_amount 值格式
                doc.invoice_date = this.convertInvoiceDateStrToDate(doc.invoice_date)
                for (const fieldName of ['notax_amount', 'tax_amount', 'invoice_amount']) {
                    doc[fieldName] = this.convertAmountStrToNum(doc[fieldName])
                }
            } else {

                // TODO
                console.error(`须处理新发票类型${type}`)
            }

        }

        return doc
    }
}