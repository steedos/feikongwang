/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-18 10:30:58
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 18:03:33
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/cost/src/triggers/index.js
 * @Description: 
 */
module.exports = {
    cost_business_loan_reimburse_trigger: require('./cost_business_loan_reimburse_trigger'),
    cost_business_out_reimburse_trigger: require('./cost_business_out_reimburse_trigger'),
    cost_daily_expense_reimburse_trigger: require('./cost_daily_expense_reimburse_trigger'),
    cost_loan_detail_trigger: require('./cost_loan_detail_trigger'),
    cost_personal_loan_trigger: require('./cost_personal_loan_trigger'),
    cost_personal_repayment_trigger: require('./cost_personal_repayment_trigger'),
    cost_reimburse_detail_triggers_check_amount: require('./cost_reimburse_detail_triggers_check_amount'),
    cost_reimburse_detail_triggers_set_has_used_by_cost: require('./cost_reimburse_detail_triggers_set_has_used_by_cost'),
    cost_reimburse_detail_triggers_update_invoice_status: require('./cost_reimburse_detail_triggers_update_invoice_status'),
}