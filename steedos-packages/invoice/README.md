<!--
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-08 16:21:56
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-11 13:27:40
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/README.md
 * @Description: 
-->
# 发票识别、查验

本模块主要处理财务发票的识别、查重、验真。

## 调用百度的接口

### 新手操作指引

- 文档：https://ai.baidu.com/ai-doc/OCR/dk3iqnq51

- 开通 `财务票据OCR` 中的 `智能财务票据识别` 和 `增值税发票验真` 服务

### 配置鉴权所需环境变量

- STEEDOS_LABS_INVOICE_BAIDU_AK={应用的API Key}
- STEEDOS_LABS_INVOICE_BAIDU_SK={应用的Secret Key}

### 智能财务票据识别 

- 接口文档：https://cloud.baidu.com/doc/OCR/s/7ktb8md0j

### 增值税发票验真

- 接口文档：https://cloud.baidu.com/doc/OCR/s/cklbnrnwe

### 识别接口中的增值税发票的细分类型与增值税发票验真接口参数发票种类对照关系

普通发票、增值税普通发票：normal_invoice

专用发票、增值税专用发票：special_vat_invoice

电子普通发票、增值税普通发票（电子）：elec_normal_invoice

增值税普通发票（卷式）：roll_normal_invoice

电子专用发票、增值税电子专用发票：elec_special_vat_invoice

通行费电子普票、通行费增值税电子普通发票：toll_elec_normal_invoice

区块链发票、区块链电子发票（目前仅支持深圳地区）：blockchain_invoice

电子发票(专用发票)、全电发票（专用发票）：elec_invoice_special

电子发票(普通发票) 、全电发票（普通发票）：elec_invoice_normal

货运运输业增值税专用发票：special_freight_transport_invoice

机动车销售发票：motor_vehicle_invoice

二手车销售发票：used_vehicle_invoice

## 查重规则

- 如果只有发票号码，则以发票号码作为查询条件，判断是否已存在
- 如果发票号码和发票代码都有，则以发票号码和发票代码组合作为查询条件，判断是否已存在
