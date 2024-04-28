/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-10 14:09:28
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-14 10:04:47
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getEmployeeMonthlyAbsentInformation.js
 * @Description: 查询该月度员工旷工天数
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (userId, date) {
        const attendanceRange = await this.getMonthlyAttendanceRange(date); //获取月度考勤范围
        const employeeMonthlyAbsentInformations = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_daily',
                query: {
                    fields: ['absent'],
                    filters: [["user", "=", userId], ["date", ">=", attendanceRange.startMonthlyDate], ["date", "<", attendanceRange.endMonthlyDate], ["status", "contains", "absent"]],
                },
            },
        );
        var employeeMonthlyAbsentCount = 0;     //月度旷工总天数
        for (const employeeMonthlyAbsent of employeeMonthlyAbsentInformations) {
            employeeMonthlyAbsentCount = employeeMonthlyAbsentCount + employeeMonthlyAbsent.absent;
        }
        const employeeAbsenteeismRules = await this.getEmployeeAbsenteeismRules(userId);  //查询旷工规则
        var lateandearlyCount = 0;
        var remark = ""
        if (employeeAbsenteeismRules.length != 0) {
            for (const absenteeismRules of employeeAbsenteeismRules) {

                if (absenteeismRules.type = "lateandearly") {
                    const employeeMonthlyLateInformation = await this.getEmployeeMonthlyLateInformation(userId, date);  //查询该月度员工迟到信息
                    const employeeMonthlyEarlyInformation = await this.getEmployeeMonthlyEarlyInformation(userId, date); //查询该月度员工早退信息
                    lateandearlyCount = employeeMonthlyLateInformation.employeeMonthlyLatecount + employeeMonthlyEarlyInformation.employeeMonthlyEarlycount;
                    if (lateandearlyCount >= absenteeismRules.total) {
                        employeeMonthlyAbsentCount = employeeMonthlyAbsentCount + (lateandearlyCount % absenteeismRules.total) * absenteeismRules.count_absent_date;
                        remark = "该月度迟到或早退累计" + lateandearlyCount + "次；根据旷工规则，每累计" + absenteeismRules.total + "次,记旷工" + absenteeismRules.count_absent_date + "天";
                    }

                }
            }
        }
        return {
            "employeeMonthlyAbsentCount": employeeMonthlyAbsentCount,   //月度旷工总天数
            "remark": remark
        }


    }
}