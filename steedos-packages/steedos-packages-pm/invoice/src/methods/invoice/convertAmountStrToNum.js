/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-12 10:59:53
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-12 13:55:46
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/invoice/src/methods/invoice/convertAmountStrToNum.js
 * @Description: 
 */
module.exports = {
    /**
     * 将发票识别出的金额转为数值，如："￥140.0元" 转为 140
     * @param string amountStr
     * @returns number
     */
    handler(amountStr) {
        let amount;
        if (amountStr) {
            amount = Number(amountStr.replace('￥', '').replace('元', ''))
        } else {
            amount = undefined // 处理 '' 空字符串的情况
        }
        return amount
    }
}