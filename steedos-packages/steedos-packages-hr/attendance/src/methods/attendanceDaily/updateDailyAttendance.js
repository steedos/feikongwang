/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-07 17:14:26
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-10 16:45:21
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceDaily/updateDailyAttendance.js
 * @Description: 续第一次打卡后的每日考勤情况
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
const moment = require('moment');
module.exports = {
    handler: async function (userId, end, work_end, originalTime, rest_start, rest_end, queryAttendanceRules) {
        //查询该用户下的当日的每日考勤情况id
        const currentDate = moment(end).format('YYYY-MM-DD');
        const newTime = new Date(currentDate);
        const ifUserFirstCheckIn = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_daily',
                query: {
                    filters: [["user", "=", userId], ["date", "=", newTime]]
                },
            },
        );
        //修改用户下的当日的每日考勤情况的下班打卡时间
        var status = ["normal"]
        var leave = ""
        var late = ""
        console.log("午休开始时间", rest_start);
        console.log("午休结束时间", rest_end);
        if (queryAttendanceRules.enable_flexible_commuting == true) {

            work_end = moment(work_end, "HH:mm").subtract(queryAttendanceRules.early, "minutes").format("HH:mm");

            if (originalTime <= work_end && ifUserFirstCheckIn[0].start == null && originalTime <= rest_start) { //判断当日员工续第一次打卡之后，考勤状态为早退+缺卡，早退打卡时间在午休时间之前
                status = ["early", "lack"]
                const rest = await this.getMinuteDifference(rest_start, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early - rest //计算早退时长
                console.log("早退时长", leave)
            } else if (originalTime <= work_end && ifUserFirstCheckIn[0].start == null && originalTime > rest_start && originalTime < rest_end) { //判断当日员工续第一次打卡之后，考勤状态为早退+缺卡，早退打卡时间在午休时间之内
                status = ["early", "lack"]
                const rest = await this.getMinuteDifference(originalTime, rest_end);
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early - rest
                console.log("早退时长", leave)
            } else if (originalTime <= work_end && ifUserFirstCheckIn[0].start == null && originalTime <= rest_end) { //判断当日员工续第一次打卡之后，考勤状态为早退+缺卡，早退打卡时间在午休时间之后
                status = ["early", "lack"]
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early
                console.log("早退时长", leave)
            } else if (ifUserFirstCheckIn[0].start == null && originalTime > work_end) {  //判断当日员工续第一次打卡之后，考勤状态是否为缺卡
                status = ["lack"]
            } else if (originalTime <= work_end && ifUserFirstCheckIn[0].status.includes("late") && originalTime <= rest_start) { //判断当日员工续第一次打卡之后，考勤状态是否为早退+迟到  早退打卡时间在午休时间之前
                status = ["early", "late"];
                console.log("考勤状态迟到+早退,早退打卡时间在午休时间之前")
                const rest = await this.getMinuteDifference(rest_start, rest_end);
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early - rest
                late = ifUserFirstCheckIn[0].late   //迟到时间
            } else if (originalTime <= work_end && ifUserFirstCheckIn[0].status.includes("late") && originalTime > rest_start && originalTime < rest_end) { //判断当日员工续第一次打卡之后，考勤状态是否为早退+迟到  早退打卡时间在午休时间之内
                status = ["early", "late"];
                console.log("考勤状态迟到+早退,早退打卡时间在午休时间之内")
                const rest = await this.getMinuteDifference(originalTime, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early - rest  //计算早退时长
                late = ifUserFirstCheckIn[0].late
            } else if (originalTime <= work_end && ifUserFirstCheckIn[0].status.includes("late") && originalTime >= rest_end) { //判断当日员工续第一次打卡之后，考勤状态是否为早退+迟到  早退打卡时间在午休时间之后
                status = ["early", "late"];
                console.log("考勤状态迟到+早退,早退打卡时间在午休时间之后")
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early  //计算早退时长
                late = ifUserFirstCheckIn[0].late
            } else if (originalTime <= work_end && originalTime <= rest_start) {   //判断当日员工续第一次打卡之后，考勤状态是否为早退 早退时间在午休时间之前
                status = ["early"];
                console.log("考勤状态早退,早退打卡时间在午休时间之前")
                const rest = await this.getMinuteDifference(rest_start, rest_end);  //计算午休时间
                console.log("包含午休时间的早退时间", await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early)
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early - rest //计算早退时长
            } else if (originalTime <= work_end && originalTime > rest_start && originalTime < rest_end) {   //判断当日员工续第一次打卡之后，考勤状态是否为早退 早退时间在午休时间之内
                status = ["early"];
                console.log("考勤状态早退,早退打卡时间在午休时间之内")
                const rest = await this.getMinuteDifference(originalTime, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early - rest //计算早退时长
            } else if (originalTime <= work_end && originalTime >= rest_end) {   //判断当日员工续第一次打卡之后，考勤状态是否为早退 早退时间在午休时间之后
                status = ["early"];
                console.log("考勤状态早退,早退打卡时间在午休时间之后")
                leave = await this.getMinuteDifference(originalTime, work_end) + queryAttendanceRules.early //计算早退时长
            } else if (ifUserFirstCheckIn[0].status.includes("late")) { //判断当日员工续第一次打卡之后，考勤状态是否为迟到
                status = ["late"];
                late = ifUserFirstCheckIn[0].late
            }
        } else {
            if (originalTime <= work_end && ifUserFirstCheckIn[0].start == null && originalTime <= rest_start) { //判断当日员工续第一次打卡之后，考勤状态为早退+缺卡，早退打卡时间在午休时间之前
                status = ["early", "lack"]
                const rest = await this.getMinuteDifference(rest_start, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) - rest //计算早退时长
                console.log("早退时长", leave)
            } else if (originalTime <= work_end && ifUserFirstCheckIn[0].start == null && originalTime > rest_start && originalTime < rest_end) { //判断当日员工续第一次打卡之后，考勤状态为早退+缺卡，早退打卡时间在午休时间之内
                status = ["early", "lack"]
                const rest = await this.getMinuteDifference(originalTime, rest_end);
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) - rest
                console.log("早退时长", leave)
            } else if (originalTime <= work_end && ifUserFirstCheckIn[0].start == null && originalTime <= rest_end) { //判断当日员工续第一次打卡之后，考勤状态为早退+缺卡，早退打卡时间在午休时间之后
                status = ["early", "lack"]
                leave = await this.getMinuteDifference(originalTime, work_end)
                console.log("早退时长", leave)
            } else if (ifUserFirstCheckIn[0].start == null && originalTime > work_end) {  //判断当日员工续第一次打卡之后，考勤状态是否为缺卡
                status = ["lack"]
            } else if (originalTime < work_end && ifUserFirstCheckIn[0].status.includes("late") && originalTime <= rest_start) { //判断当日员工续第一次打卡之后，考勤状态是否为早退+迟到  早退打卡时间在午休时间之前
                status = ["early", "late"];
                const rest = await this.getMinuteDifference(rest_start, rest_end);
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) - rest
                late = ifUserFirstCheckIn[0].late   //迟到时间
            } else if (originalTime < work_end && ifUserFirstCheckIn[0].status.includes("late") && originalTime > rest_start && originalTime < rest_end) { //判断当日员工续第一次打卡之后，考勤状态是否为早退+迟到  早退打卡时间在午休时间之内
                status = ["early", "late"];
                const rest = await this.getMinuteDifference(originalTime, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) - rest  //计算早退时长
                late = ifUserFirstCheckIn[0].late
            } else if (originalTime < work_end && ifUserFirstCheckIn[0].status.includes("late") && originalTime >= rest_end) { //判断当日员工续第一次打卡之后，考勤状态是否为早退+迟到  早退打卡时间在午休时间之后
                status = ["early", "late"];
                leave = await this.getMinuteDifference(originalTime, work_end)   //计算早退时长
                late = ifUserFirstCheckIn[0].late
            } else if (originalTime < work_end && originalTime <= rest_start) {   //判断当日员工续第一次打卡之后，考勤状态是否为早退 早退时间在午休时间之前
                status = ["early"];
                const rest = await this.getMinuteDifference(rest_start, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) - rest //计算早退时长
            } else if (originalTime < work_end && originalTime > rest_start && originalTime < rest_end) {   //判断当日员工续第一次打卡之后，考勤状态是否为早退 早退时间在午休时间之内
                status = ["early"];
                const rest = await this.getMinuteDifference(originalTime, rest_end);  //计算午休时间
                console.log("午休时间", rest)
                leave = await this.getMinuteDifference(originalTime, work_end) - rest //计算早退时长
            } else if (originalTime < work_end && originalTime >= rest_end) {   //判断当日员工续第一次打卡之后，考勤状态是否为早退 早退时间在午休时间之后
                status = ["early"];
                leave = await this.getMinuteDifference(originalTime, work_end)  //计算早退时长
            } else if (ifUserFirstCheckIn[0].status.includes("late")) { //判断当日员工续第一次打卡之后，考勤状态是否为迟到
                status = ["late"];
                late = ifUserFirstCheckIn[0].late
            }
        }
        await this.broker.call(
            'objectql.update',
            {
                objectName: 'attendance_daily',
                doc: {
                    end: end ? end : null,
                    status: status ? status : null,
                    leave: leave ? leave : null,
                    late: late ? late : null
                },
                id: ifUserFirstCheckIn[0]._id
            },
        );
    }
}