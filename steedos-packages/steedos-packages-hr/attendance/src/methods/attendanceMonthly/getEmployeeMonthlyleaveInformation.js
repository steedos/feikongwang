/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-10 12:48:30
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-10 13:25:37
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getEmployeeMonthlyleaveInformation.js
 * @Description: 查询该月度员工请假天数
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (userId, date) {
        const attendanceRange = await this.getMonthlyAttendanceRange(date); //获取月度考勤范围
        const employeeMonthlyleaveInformations = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_daily',
                query: {
                    fields: ['annual_leave'],
                    filters: [["user", "=", userId], ["date", ">=", attendanceRange.startMonthlyDate], ["date", "<", attendanceRange.endMonthlyDate], ["status", "contains", "leave"]],
                },
            },
        );
        var employeeMonthlyleavecount = 0;     //月度请假总天数
        for (const employeeMonthlyleave of employeeMonthlyleaveInformations) {
            employeeMonthlyleavecount = employeeMonthlyleavecount + employeeMonthlyleave.annual_leave
        }
        return  employeeMonthlyleavecount;    //月度请假总天数
           

    }
}