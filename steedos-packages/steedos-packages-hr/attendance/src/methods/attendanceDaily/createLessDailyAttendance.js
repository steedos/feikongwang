/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-07 17:14:26
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-08 16:46:42
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceDaily/createLessDailyAttendance.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
//创建每日考勤情况（缺少上班打卡） 考勤状态（status）：（缺卡）lack
const moment = require('moment');
module.exports = {
    handler: async function (userId, start, end, company, data_source, space, department, work_end, originalTime, rest_start, rest_end, queryAttendanceRules) {
        var status = ["lack"];
        var leave = "";
        //判断考勤规则是否开启弹性考勤
        if (queryAttendanceRules.enable_flexible_commuting == true) {
            work_end = moment(work_end, "HH:mm").subtract(queryAttendanceRules.early, "minutes").format("HH:mm");
            if (originalTime < work_end && originalTime <= rest_start) {    //判断当日员工是否是缺卡并且早退（在弹性考核下）早退打卡时间在午休时间之前
                status = ["lack", "early"];
                const rest = await this.getMinuteDifference(rest_start, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early - rest;
                console.log("早退时长", leave);
            } else if (originalTime < work_end && originalTime > rest_start && originalTime < rest_end) {    //判断当日员工是否是缺卡并且早退（在弹性考核下）早退打卡时间在午休时间之内
                status = ["lack", "early"];
                const rest = await this.getMinuteDifference(originalTime, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early - rest;
                console.log("早退时长", leave);
            } else if (originalTime < work_end && originalTime >= rest_end) {    //判断当日员工是否是缺卡并且早退（在弹性考核下）早退打卡时间在午休时间之后
                status = ["lack", "early"];
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early;
                console.log("早退时长", leave);
            } else if (originalTime >= work_end) {
                status = ["lack"]
            }
        } else {
            if (originalTime < work_end && originalTime <= rest_start) {    //判断当日员工是否是缺卡并且早退（在弹性考核下）早退打卡时间在午休时间之前
                status = ["lack", "early"];
                const rest = await this.getMinuteDifference(rest_start, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early;
                console.log("早退时长", leave);
            } else if (originalTime < work_end && originalTime > rest_start && originalTime < rest_end) {    //判断当日员工是否是缺卡并且早退（在弹性考核下）早退打卡时间在午休时间之内
                status = ["lack", "early"];
                const rest = await this.getMinuteDifference(originalTime, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early;
                console.log("早退时长", leave);
            } else if (originalTime < work_end && originalTime >= rest_end) {    //判断当日员工是否是缺卡并且早退（在弹性考核下）早退打卡时间在午休时间之后
                status = ["lack", "early"];
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early;
                console.log("早退时长", leave);
            } else if (originalTime >= work_end) {
                status = ["lack"]
            }
        }
        var date = null;
        if (start != "") {
            date = moment(start).utcOffset(8).format('YYYY-MM-DD');
            date = new Date(date);
        } else if (end != "") {
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
            "leave": leave,
            "owner": userId,
            "created_by": userId,
            "modified_by": userId
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