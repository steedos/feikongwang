/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-09 18:13:58
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-10 09:54:09
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getUsers.js
 * @Description: 查询已启用的考勤规则下的考勤组下的员工信息
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
const moment = require('moment');
module.exports = {
    handler: async function () {
        //查询已启用的考勤规则
        const attendanceRulesIds = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_rule_settings',
                query: {
                    fields: ["_id"],
                    filters: ["status", "=", "open"]
                },
            },
        );
        console.log("已启用的考勤规则", attendanceRulesIds);
        var attendanceUsersIds = []
        for (const attendanceRulesId of attendanceRulesIds) {
            console.log("考勤规则id",attendanceRulesId)
            //查询使用已启用的考勤规则下的考勤组的考勤人员
            const userIds = await this.broker.call(
                'objectql.find',
                {
                    objectName: 'attendance_group',
                    query: {
                        fields: ["users"],
                        filters: ["attendance_rule_settings", "=", attendanceRulesId._id]
                    },
                },
            );
           console.log("userIds",userIds);
          for(const user of userIds[0].users){
            attendanceUsersIds.push(user)
          }
           
        }
        console.log("已启用的考勤规则下的考勤组下的员工id",attendanceUsersIds)
        return attendanceUsersIds;

    }
}