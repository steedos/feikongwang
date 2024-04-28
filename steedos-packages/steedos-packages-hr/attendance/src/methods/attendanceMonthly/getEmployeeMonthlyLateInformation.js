/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-10 10:45:28
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-11 10:08:13
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getEmployeeMonthlyLateInformation.js
 * @Description: 查询该月度员工迟到信息
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (userId, date) {
        const attendanceRange = await this.getMonthlyAttendanceRange(date); //获取月度考勤范围
        const employeeMonthlyLateInformations = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_daily',
                query: {
                    fields: ['late'],
                    filters: [["user", "=", userId], ["date", ">=", attendanceRange.startMonthlyDate], ["date", "<", attendanceRange.endMonthlyDate], ["status", "contains", "late"]],
                },
            },
        );
        var employeeMonthlyLateTimes = 0;     //月度迟到总时长
        for (const employeeMonthlyLate of employeeMonthlyLateInformations) {
            employeeMonthlyLateTimes = employeeMonthlyLateTimes + employeeMonthlyLate.late
        }
        return {
            "employeeMonthlyLateTimes": employeeMonthlyLateTimes,    //月度迟到总时长
            "employeeMonthlyLatecount": employeeMonthlyLateInformations.length  //月度迟到总次数
        }

    }
}