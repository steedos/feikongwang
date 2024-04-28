/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-10 17:37:40
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-11 10:39:58
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getEmployeeAbsenteeismRules.js
 * @Description: 查询该员工的旷工规则
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (userId) {
        //查询该用户属于那个考勤组
        const attendanceGroups = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_group',
                query: {
                    filters: ["users", "contains", userId],
                },
            },
        );
        var absenteeismRuleses = []
        for (const attendanceGroup of attendanceGroups) {
            //查询考勤规则
            const attendanceRuleSettings = await this.broker.call(
                'objectql.find',
                {
                    objectName: 'attendance_rule_settings',
                    query: {
                        filters: [["_id", "=", attendanceGroup.attendance_rule_settings], ["status", "=", "open"]],
                    },
                },
            );
            if (attendanceRuleSettings[0] != undefined) {
                //查询旷工规则
                const absenteeismRules = await this.broker.call(
                    'objectql.find',
                    {
                        objectName: 'attendance_absent_settings',
                        query: {
                            filters: ["attendance_rule_settings", "=", attendanceRuleSettings[0]._id],
                        },
                    },
                );
                for(const Rules of absenteeismRules){
                    absenteeismRuleses.push(Rules)
                }
                
            }


        }
        return absenteeismRuleses;

    }
}