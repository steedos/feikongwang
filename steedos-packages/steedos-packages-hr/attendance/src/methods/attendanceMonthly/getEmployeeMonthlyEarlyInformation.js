/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-10 11:26:34
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-11 17:39:42
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getEmployeeMonthlyEarlyInformation.js
 * @Description: 查询该月度员工早退信息
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (userId, date) {
        const attendanceRange = await this.getMonthlyAttendanceRange(date); //获取月度考勤范围
        const employeeMonthlyEarlyInformations= await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_daily',
                query: {
                    fields: ['leave'],
                    filters: [["user", "=", userId], ["date", ">=", attendanceRange.startMonthlyDate], ["date", "<", attendanceRange.endMonthlyDate], ["status", "contains", "early"]],
                },
            },
        );
        var employeeMonthlyEarlyTimes = 0;     //月度早退总时长
        for (const employeeMonthlyEarly of employeeMonthlyEarlyInformations) {
            employeeMonthlyEarlyTimes = employeeMonthlyEarlyTimes + employeeMonthlyEarly.leave
        }
        return {
            "employeeMonthlyEarlyimes": employeeMonthlyEarlyTimes,    //月度早退总时长
            "employeeMonthlyEarlycount": employeeMonthlyEarlyInformations.length  //月度早退总次数
        }

    }
}