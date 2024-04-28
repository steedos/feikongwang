/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-10 10:03:45
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-14 13:06:36
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/createAttendanceMonthly.js
 * @Description: 创建月度考勤报表
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
const moment = require('moment');
module.exports = {
    handler: async function (userIds, date, theMonthClockIndays) {
        for (const userId of userIds) {
            const user = await this.getEmployeeInformation(userId);  //查询员工信息
            const employeeMonthlyLateInformation = await this.getEmployeeMonthlyLateInformation(userId, date);  //查询该月度员工迟到信息
            const employeeMonthlyEarlyInformation = await this.getEmployeeMonthlyEarlyInformation(userId, date); //查询该月度员工早退信息
            const employeeMonthlyleaveInformation = await this.getEmployeeMonthlyleaveInformation(userId, date);  //查询该月度员工请假天数
            const employeeMonthlybusinessInformation = await this.getEmployeeMonthlybusinessInformation(userId, date);  //查询该月度员工出差天数
            const employeeMonthlyOutInformation = await this.getEmployeeMonthlyOutInformation(userId, date);  //查询该月度员工外出天数
            const employeeMonthlyAbsentInformation = await this.getEmployeeMonthlyAbsentInformation(userId, date);  //查询该月度员工旷工天数
            const employeeMonthlyWorkingInformation = await this.getEmployeeMonthlyWorkingInformation(userId, date);  //查询该月度员工加班时长
            const employeeMonthlyNormalInformation = await this.getEmployeeMonthlyNormalInformation(userId, date);  //查询该月度员工正常考勤天数
            attendanceMonthlyDate = date.substring(0, 7);
            let doc = {
                "name": attendanceMonthlyDate,
                "user": userId,
                "company": user.company_id,
                "department": user.organization,
                "days": theMonthClockIndays,
                "days_actual": employeeMonthlyNormalInformation,
                "days_business": employeeMonthlybusinessInformation,
                "days_leave": employeeMonthlyleaveInformation,
                "days_out": employeeMonthlyOutInformation,
                "days_absent": employeeMonthlyAbsentInformation.employeeMonthlyAbsentCount,
                "days_overtime": employeeMonthlyWorkingInformation,
                "late_count": employeeMonthlyLateInformation.employeeMonthlyLatecount,
                "late": employeeMonthlyLateInformation.employeeMonthlyLateTimes,
                "leave_count": employeeMonthlyEarlyInformation.employeeMonthlyEarlycount,
                "leave": employeeMonthlyEarlyInformation.employeeMonthlyEarlyimes,
                "owner": userId,
                "created_by": userId,
                "modified_by": userId,
                "space": user.space,
                "remark": employeeMonthlyAbsentInformation.remark ? employeeMonthlyAbsentInformation.remark : null

            }
            const attendanceMonthlyInformation = await this.findAttendanceMonthlyInformation(date, userId); //根据userId与结算月度查询月度考勤报表
            console.log("月度考勤报表是否有数据", attendanceMonthlyInformation);
            if (!!attendanceMonthlyInformation) {       //如果存在，则修改该记录，不存在则创建
                console.log("修改数据........................")
                console.log("oooiviohvs", doc)
                console.log("迟到次数", doc.late_count)
                 await this.broker.call(
                    'objectql.update',
                    {
                        objectName: 'attendance_month',
                        doc: doc,
                        id: attendanceMonthlyInformation._id
                    },
                );
            } else {
                console.log("创建数据")
                await this.broker.call( 
                    'objectql.insert',
                    {
                        objectName: 'attendance_month',
                        doc
                    },
                );
            }

        }
    }
}