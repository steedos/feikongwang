/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-16 09:36:51
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-25 14:11:50
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/finance/src/triggers/index.js
 * @Description: 
 */
module.exports = {
    finance_invoice_detail_trigger_check_amount: require('./finance_invoice_detail_trigger_check_amount'),
    finance_invoice_trigger_check_amount: require('./finance_invoice_trigger_check_amount'),
    finance_invoice_trigger_set_default_value: require('./finance_invoice_trigger_set_default_value'),
    finance_payment_trigger_check_amount: require('./finance_payment_trigger_check_amount'),
    finance_payment_trigger_set_default_value: require('./finance_payment_trigger_set_default_value'),
    finance_payment_triggers: require('./finance_payment_triggers'),
    finance_receive_trigger_set_default_value: require('./finance_receive_trigger_set_default_value'),
}