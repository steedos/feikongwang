/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-04 15:24:58
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-06 11:10:04
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance-service/src/methods/dailySettlement/getAbsentRuleWithOutTotal.js
 * @Description: 根据考勤规则和类型查找一个旷工规则，排除掉包含月累计次数的规则
 */
const _ = require('lodash');
module.exports = {
    /**
     * 
     * @param {string} ruleId 
     * @param {string | string[]} types 
     */
    handler: async function (ruleId, types) {
        const typeFilter = _.isArray(types) ? ['type', 'in', types] : ['type', '=', types]
        const absentRules = await this.broker.call('objectql.find', {
            objectName: 'attendance_absent_settings',
            query: {
                filters: [
                    ['attendance_rule_settings', '=', ruleId],
                    typeFilter
                ]
            }
        })
        const aRule = _.find(absentRules, function(o) { return !o.total; })
        return aRule;
    }
}