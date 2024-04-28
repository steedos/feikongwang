/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-07 17:14:26
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-08 16:46:47
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceDaily/createDailyAttendance.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
//创建每日考勤情况
const moment = require('moment');
module.exports = {
    handler: async function (userId, start, end, company, data_source, space, department, originalTime, work_start, rest_start, rest_end, queryAttendanceRules) {
        var status = ["normal"];
        var late = ""
        console.log("午休开始时间", rest_start)
        console.log("午休结束时间", rest_end)
        if (queryAttendanceRules.enable_flexible_commuting == true) {    //判断考勤规则是否开启弹性考勤
            work_start = moment(work_start, "HH:mm").add(queryAttendanceRules.lateness, 'minutes').format("HH:mm");
            if (originalTime > work_start && originalTime >= rest_end) {  //判断员工当日是否迟到,打卡时间在午休时间结束之后
                status = ["late"];
                const rest = await this.getMinuteDifference(rest_start, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                late = await this.getMinuteDifference(work_start, originalTime) - rest + queryAttendanceRules.lateness; //计算迟到时间
                console.log("打卡时间在午休时间结束之后", late)
            } else if (originalTime > work_start && rest_start <= originalTime && originalTime <= rest_end) { //判断员工当日是否迟到,打卡时间在午休时间之内
                status = ["late"];
                const rest = await this.getMinuteDifference(rest_start, originalTime);  //计算午休时间
                console.log("午休时间", rest)
                late = await this.getMinuteDifference(work_start, originalTime) - rest + queryAttendanceRules.lateness;   //计算迟到时间
                console.log("打卡时间在午休时间之内", late)
            } else if (originalTime > work_start && originalTime<=rest_start) {   //判断员工当日是否迟到,打卡时间在午休时间之前
                status = ["late"];
                late = await this.getMinuteDifference(work_start, originalTime) + queryAttendanceRules.lateness;   //计算迟到时间
                console.log("打卡时间在午休时间之前", late)
            } else if (originalTime <= work_start) {
                status = ["normal"]
            }
        } else {
            if (originalTime > work_start && originalTime >= rest_end) {  //判断员工当日是否迟到,打卡时间在午休时间结束之后
                status = ["late"];
                const rest = await this.getMinuteDifference(rest_start, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                late = await this.getMinuteDifference(work_start, originalTime) - rest; //计算迟到时间
                console.log("打卡时间在午休时间结束之后", late)
            } else if (originalTime > work_start && rest_start <= originalTime && originalTime <= rest_end) { //判断员工当日是否迟到,打卡时间在午休时间之内
                status = ["late"];
                const rest = await this.getMinuteDifference(rest_start, originalTime);  //计算午休时间
                console.log("午休时间", rest)
                late = await this.getMinuteDifference(work_start, originalTime) - rest;   //计算迟到时间
                console.log("打卡时间在午休时间之内", late)
            } else if (originalTime > work_start && originalTime<=rest_start) {   //判断员工当日是否迟到,打卡时间在午休时间之前
                status = ["late"];
                late = await this.getMinuteDifference(work_start, originalTime);   //计算迟到时间
                console.log("打卡时间在午休时间之前", late)
            } else if (originalTime <= work_start) {
                status = ["normal"]
            }
        }



        // const currentDate = moment().format('YYYY-MM-DD');
        // const newTime = new Date(currentDate);
        var date = null;
        if(start != ""){
            date = moment(start).utcOffset(8).format('YYYY-MM-DD');
            date = new Date(date);
        }else if(end != ""){
            date = moment(end).utcOffset(8).format('YYYY-MM-DD');
            date = new Date(date);
        }
        let doc = {
            "user": userId,
            "start": start ? start : null,
            "data_source": data_source,
            "space": space,
            "date": date,
            "end": end ? end : null,
            "company": company,
            "department": department,
            "status": status,
            "late": late ? late : null,
            "owner": userId,
            "created_by":userId,
            "modified_by":userId

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