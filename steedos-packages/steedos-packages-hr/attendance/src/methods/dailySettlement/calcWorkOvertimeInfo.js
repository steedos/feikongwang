/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-19 10:20:26
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-21 17:45:31
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/calcWorkOvertimeInfo.js
 * @Description: 加班
 */
const moment = require('moment');
module.exports = {
    handler: async function (userId, workDay, {
        attendanceInfo, // 用户考勤信息，{ start: 实际上班打卡时间, end }
        rule, // 考勤规则
        ctx
    }) {

        // 获取查询范围
        const findRange = await this.findRange(workDay);
        // 正常上班开始时间
        const workStart = this.generateDateTimeByDateAndTime(workDay, rule.work_start);
        // 正常上班结束时间
        const workEnd = this.generateDateTimeByDateAndTime(workDay, rule.work_end);
        // 午休开始时间
        const restStart = this.generateDateTimeByDateAndTime(workDay, rule.rest_start);
        // 午休结束时间
        const restEnd = this.generateDateTimeByDateAndTime(workDay, rule.rest_end);
        // 下班结束打卡时间
        const end_quit_clock = this.generateDateTimeByDateAndTime(workDay, rule.end_quit_clock);
        var overtimeformations = await broker.call('objectql.find', {
            objectName: "attendance_overtime",
            query: {
                filters: [
                    ['staff', '=', userId],
                    ['instance_state', '=', 'approved'],
                    [
                        [['start', '>=', workEnd], ['end', '>=', workEnd],['end','<=',end_quit_clock]],
                        "or",
                        [['start', '<=', workEnd], ["end", '>', workEnd],["end",'<=',end_quit_clock]],
                    ]
                ]
            }
        });

        var overtimeRef = []; //加班记录id
        var totalMinites = 0; //加班总时长
        var duration = [];
        if (!!overtimeformations[0]) {
            
            for (var overtimeformation of overtimeformations) {
                var overtimeStart = new Date(overtimeformation.start);
                var overtimeEnd = new Date(overtimeformation.end);
                if (overtimeStart < workEnd && overtimeEnd> workEnd) {
                    totalMinites += overtimeEnd- workEnd
                    overtimeRef.push(overtimeformation._id);
                    duration.push({ "start": workEnd, "end": overtimeEnd});
                    continue;
                }
                if (overtimeStart >= workEnd) {
                    totalMinites += overtimeEnd- overtimeStart
                    overtimeRef.push(overtimeformation._id);
                    duration.push({ "start": overtimeStart, "end": overtimeEnd});
                    continue;
                }
            }
        } else {
            console.log("该员工没有加班记录")
        }
        totalMinites = await this.millisecondToMinites(totalMinites) //转为分钟
        return {
            ids: overtimeRef,
            totalMinites: totalMinites,  // 当天加班总时长，返回0表示没有加班
            duration: duration
        }
    }
}