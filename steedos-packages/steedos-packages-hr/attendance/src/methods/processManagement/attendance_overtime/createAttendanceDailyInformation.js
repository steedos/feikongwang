/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-12 16:20:49
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-14 11:27:17
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/processManagement_working/createAttendanceDailyInformation.js
 * @Description: 加班台账-审批通过时，并且每日考勤情况没有该加班人
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
var moment = require('moment');
module.exports = {
    handler: async function (workOvertimeTrip) {
        console.log("加班流程-创建每日考勤------------")
        console.log("加班时长",workOvertimeTrip.hours)
        const currentDate = moment(workOvertimeTrip.start).utcOffset(8).format('YYYY-MM-DD');
        const newTime = new Date(currentDate);
        const overtime_ref = []
        overtime_ref.push(workOvertimeTrip._id)
        const doc = {
            "user":workOvertimeTrip.staff,
            "owner":workOvertimeTrip.staff,
            "space":workOvertimeTrip.space,
            "company":workOvertimeTrip.company,
            "department":workOvertimeTrip.department,
            "status":"overtime",
            "overtime":workOvertimeTrip.hours,
            "date": newTime,
            "overtime_ref":overtime_ref
        }
        await this.broker.call(
            'objectql.insert',
            {
                objectName: 'attendance_daily',
                doc
                
            },
        );
    }
}