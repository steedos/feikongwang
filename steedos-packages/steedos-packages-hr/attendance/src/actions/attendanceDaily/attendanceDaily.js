/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-07 17:14:26
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-12 13:09:41
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/actions/attendanceDaily/attendanceDaily.js
 * @Description: 每日考勤情况
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
'use strict';
module.exports = {
    handler: async function (ctx) {
        const moment = require('moment');
        const userId = ctx.params.userId; //打卡员工id
        const originalDateTime = ctx.params.originalDateTime //原始打卡时间
       
        const space = ctx.params.space
        const data_source = ctx.params.data_source //数据来源
        const company = ctx.params.company
        const department = ctx.params.department
        const queryAttendanceRules = await this.queryAttendanceRules(userId);  //获取该员工下的考勤规则
        if (queryAttendanceRules) {         //判断该员工是否有考勤组
            const originalTime = await this.originalTimeFormat(originalDateTime); //当天原始打卡的时间
            const work_start = await this.formatAttendanceRulesTime(queryAttendanceRules.work_start);//上班班时间
            const work_end = await this.formatAttendanceRulesTime(queryAttendanceRules.work_end);//下班时间
            const begins_work_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.begins_work_clock);//上班开始打卡时间
            const end_work_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.end_work_clock);//上班结束打卡时间
            const begins_quit_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.begins_quit_clock); //下班打卡开始时间
            var end_quit_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.end_quit_clock); //下班打卡结束时间
            const rest_start = await this.formatAttendanceRulesTime(queryAttendanceRules.rest_start); //午休开始时间
            const rest_end = await this.formatAttendanceRulesTime(queryAttendanceRules.rest_end); //午休结束时间
            const ifCheckIndata = await this.ifFirstCheckIn(userId,originalDateTime);   //判断当日员工每日考勤是否有记录
            console.log("判断当日员工每日考勤是否有记录",ifCheckIndata)
            //如果下班结束打卡时间为:"00:00:00",将之转换为"24:00:00",方便后面比较时间
            if(end_quit_clock=="00:00:00"){
                end_quit_clock = "24:00:00";
            }
            var start = "";
            var end = ""
            //判断是否是上班打卡
            if (!ifCheckIndata) {
                if (originalTime >= begins_work_clock && originalTime <= end_work_clock) {
                    start = originalDateTime;
                } else if(originalTime>=begins_quit_clock && originalTime<=end_quit_clock){
                    end = originalDateTime;
                }

            }

            //判断是否是下班打卡
            if (ifCheckIndata && originalTime >= begins_quit_clock && originalTime <= end_quit_clock) {
                end = originalDateTime
            }

            //判断是插入数据还是修改数据
            if (ifCheckIndata) {
                if(originalTime>=begins_quit_clock){
                //修改每日考勤情况
                console.log("下班打卡时间",originalTime);
                await this.updateDailyAttendance(userId, end, work_end, originalTime, rest_start, rest_end, queryAttendanceRules)
                }
            } else if (start != "") {
                //创建每日考勤情况
                console.log("下班打卡时间",originalTime);
                await this.createDailyAttendance(userId, start, end, company, data_source, space, department, originalTime, work_start, rest_start, rest_end, queryAttendanceRules);
            } else if (start == "") {
                //创建每日考勤情况（缺少上班卡情况）
                console.log("缺卡-下班打卡时间",originalTime);
                await this.createLessDailyAttendance(userId, start, end, company, data_source, space, department, work_end, originalTime, rest_start, rest_end, queryAttendanceRules);
            }
        }

    }
}