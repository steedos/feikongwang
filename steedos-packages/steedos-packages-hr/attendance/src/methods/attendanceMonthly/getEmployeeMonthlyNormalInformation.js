/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-10 15:18:21
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-10 15:24:53
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getEmployeeMonthlyNormalInformation.js
 * @Description: 查询该月度员工正常天数
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (userId, date) {
        const attendanceRange = await this.getMonthlyAttendanceRange(date); //获取月度考勤范围
        const employeeMonthlyNormalInformations = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_daily',
                query: {
                    filters: [["user", "=", userId], ["date", ">=", attendanceRange.startMonthlyDate], ["date", "<", attendanceRange.endMonthlyDate], ["status", "contains", "normal"]],
                },
            },
        );
        var employeeMonthlyNormalCount = employeeMonthlyNormalInformations.length;     //月度正常总天数
        console.log("该月度员工正常天数",employeeMonthlyNormalCount)
        return  employeeMonthlyNormalCount;    
           

    }
}