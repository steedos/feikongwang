/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-10 13:47:19
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-10 14:16:44
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getEmployeeMonthlyOutInformation.js
 * @Description: 查询该月度员工外出总天数
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (userId, date) {
        const attendanceRange = await this.getMonthlyAttendanceRange(date); //获取月度考勤范围
        const employeeMonthlyOutInformations = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_daily',
                query: {
                    fields: ['going_out'],
                    filters: [["user", "=", userId], ["date", ">=", attendanceRange.startMonthlyDate], ["date", "<", attendanceRange.endMonthlyDate], ["status", "contains", "out"]],
                },
            },
        );
        var employeeMonthlyOutCount = 0;     //月度外出总天数
        for (const employeeMonthlyOut of employeeMonthlyOutInformations) {
            employeeMonthlyOutCount = employeeMonthlyOutCount + employeeMonthlyOut.going_out
        }
        return  employeeMonthlyOutCount;    //月度外出总天数
           

    }
}