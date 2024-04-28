/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-10 14:27:24
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-14 10:05:47
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getEmployeeMonthlyWorkingInformation.js
 * @Description:  查询该月度员工加班总时长
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (userId, date) {
        const attendanceRange = await this.getMonthlyAttendanceRange(date); //获取月度考勤范围
        const employeeMonthlyWorkingInformations = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_daily',
                query: {
                    fields: ['overtime'],
                    filters: [["user", "=", userId], ["date", ">=", attendanceRange.startMonthlyDate], ["date", "<", attendanceRange.endMonthlyDate]],
                },
            },
        );
        var employeeMonthlyWorkingCount = 0;     //月度加班总时长
        for (const employeeMonthlyWorking of employeeMonthlyWorkingInformations) {
            if(employeeMonthlyWorking.overtime!=undefined){
                console.log("加班时间",employeeMonthlyWorking.overtime)
                employeeMonthlyWorkingCount = employeeMonthlyWorkingCount + employeeMonthlyWorking.overtime
            }
           
        }
        console.log("月度加班时长",employeeMonthlyWorkingCount)
        return  employeeMonthlyWorkingCount;    //月度加班总时长
           

    }
}