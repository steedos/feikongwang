/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-10 13:14:47
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-10 13:24:43
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getEmployeeMonthlybusinessInformation.js
 * @Description:  查询该月度员工出差天数
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (userId, date) {
        const attendanceRange = await this.getMonthlyAttendanceRange(date); //获取月度考勤范围
        const employeeMonthlybusinessInformations = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_daily',
                query: {
                    fields: ['business_out'],
                    filters: [["user", "=", userId], ["date", ">=", attendanceRange.startMonthlyDate], ["date", "<", attendanceRange.endMonthlyDate], ["status", "contains", "business"]],
                },
            },
        );
        var employeeMonthlybusinesscount = 0;     //月度出差总天数
        for (const employeeMonthlybusiness of employeeMonthlybusinessInformations) {
            employeeMonthlybusinesscount = employeeMonthlybusinesscount + employeeMonthlybusiness.business_out
        }
        return  employeeMonthlybusinesscount;    //月度出差总天数
           

    }
}