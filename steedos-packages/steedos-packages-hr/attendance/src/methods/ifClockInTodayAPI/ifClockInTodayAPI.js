/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-07 17:14:26
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-12 12:00:06
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/ifClockInTodayAPI/ifClockInTodayAPI.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
//判断当日是否打卡
const moment = require('moment');
module.exports = {
    handler: async function (userId,today) {
        const currentDate = moment(today).format('YYYY-MM-DD');
        const newTime = new Date(currentDate);
        //查询节假日
        const ifIsDeploymentWorkday = await this.broker.call(
            'objectql.find',
            {
                objectName: 'holidays',
                query: {
                    filters: ["date", "=", newTime],
                },
            },
        );
        console.log("节假日", ifIsDeploymentWorkday)
        console.log("今天星期",moment(today).isoWeekday())
        var queryAttendanceRules = null;
        try {
            queryAttendanceRules = await this.queryAttendanceRules(userId); //查询员工下的考勤规则
        } catch (error) {
            console.log("===>",error)
        }
        var ifClockIn = false;
        let description;
        if (queryAttendanceRules) { //true 表示该员工拥有考勤规则。false :表示该员工没有考勤规则
            if (!!ifIsDeploymentWorkday[0]) { //判断当日在节假日是否有数据
                if (ifIsDeploymentWorkday[0].type == "adjusted_working_day") {   //判断当日是否是调配工作日
                    console.log("调配工作日")
                    console.log("queryAttendanceRules",queryAttendanceRules)
                    const begins_work_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.begins_work_clock);//上班开始打卡时间
                    const end_work_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.end_work_clock);//上班结束打卡时间
                    const begins_quit_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.begins_quit_clock); //下班打卡开始时间
                    const end_quit_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.end_quit_clock); //下班打卡结束时间
                    const TimeOfTheDay = await this.getTimeOfTheDay();

                    if (begins_work_clock <= TimeOfTheDay && end_work_clock >= TimeOfTheDay) {
                        ifClockIn = true;
                    } else if (begins_quit_clock <= TimeOfTheDay && end_quit_clock >= TimeOfTheDay) {
                        ifClockIn = true;
                    } else {
                        description = '未在打卡时间范围'
                    }
                } else {
                    description = '未在打卡时间范围'
                }
            } else if (moment(today).isoWeekday() >= 1 && moment(today).isoWeekday() <= 5) { //判断当日是否是星期一到星期五的某一天
                console.log("正常工作日")
                const begins_work_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.begins_work_clock);//上班开始打卡时间
                const end_work_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.end_work_clock);//上班结束打卡时间
                const begins_quit_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.begins_quit_clock); //下班打卡开始时间
                const end_quit_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.end_quit_clock); //下班打卡结束时间
                const TimeOfTheDay = await this.getTimeOfTheDay();
                console.log("正常工作日，上班打卡时间", begins_work_clock)
                console.log("正常工作日，上班打卡结束时间", end_work_clock)
                console.log("今日时间", TimeOfTheDay)
                if (begins_work_clock <= TimeOfTheDay && end_work_clock >= TimeOfTheDay) {
                    console.log("正常上班打卡")
                    ifClockIn = true;
                } else if (begins_quit_clock <= TimeOfTheDay && end_quit_clock >= TimeOfTheDay) {
                    console.log("正常下班打卡")
                    ifClockIn = true;
                } else {
                    description = '未在打卡时间范围'
                }
            } else {
                description = '休息日无需打卡'
            }
            
        } else {
            description = '请联系管理员设置考勤规则！'
        }
        return { ifClockIn, description }
    }
}