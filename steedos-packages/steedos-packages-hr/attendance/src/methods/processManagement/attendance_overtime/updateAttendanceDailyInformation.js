/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-12 15:48:03
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-14 13:00:40
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/processManagement_working/updateAttendanceDailyInformation.js
 * @Description: 修改每日考勤情况
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (workOvertimeTrip,attendanceDaily) {
        console.log("加班流程-修改每日考勤------------");
        var overtime_ref = [];
        var overtime = 0;
        if(attendanceDaily.overtime_ref){
            overtime = attendanceDaily.overtime+workOvertimeTrip.hours
           for(const workingId of attendanceDaily.overtime_ref){
             overtime_ref.push(workingId)
           }
            overtime_ref.push(workOvertimeTrip._id);
            console.log("每日考勤总加班记录。。。。。。。",overtime_ref)
        }else{
            overtime_ref.push(workOvertimeTrip._id);
            overtime = workOvertimeTrip.hours
        }
       
        await this.broker.call(
            'objectql.update',
            {
                objectName: 'attendance_daily',
                doc: {
                    "overtime":overtime,
                    "overtime_ref":overtime_ref
                    
                },
                id: attendanceDaily._id 
            },
        );
    }
}