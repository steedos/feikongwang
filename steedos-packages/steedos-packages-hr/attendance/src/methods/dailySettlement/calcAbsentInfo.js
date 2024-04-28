/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-19 10:20:26
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-21 17:42:31
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/calcAbsentInfo.js
 * @Description: 上下班打卡时间都没有
 */
module.exports = {
    handler: async function (userId, workDay,
        attendanceInfo, // 用户考勤信息，{ start: 实际上班打卡时间, end }
        rule, // 考勤规则
        ctx,
        leaveInfo, // 请假信息
        businessTripInfo, // 出差信息
        outInfo, // 外出信息
    ) {
        // 考虑请假、出差、外出

        // 根据考勤规则，计算出当天的应工作时长

        // 总工作时长=外出+出差+请假+考勤上班时长（end-start）

        // 旷工时长=应工作时长-总工作时长

        // 考勤规则中的旷工规则设置的时长=迟到或早退 ？ 迟到或早退 ： 。。。。

        // 是否旷工=旷工时长>=考勤规则中的旷工规则设置的时长

        const attendanceDuration = await this.countAttendanceDuration(attendanceInfo.start, attendanceInfo.end, rule, workDay); //计算当日考勤时长

        const totalworkingMinites = leaveInfo.totalMinites + businessTripInfo.totalMinites + outInfo.totalMinites + attendanceDuration; //总工作时长

        const absenteeismDuration = rule.daily_hours - totalworkingMinites; //旷工时长

        const employeeAbsenteeismRules = await this.getEmployeeAbsenteeismRules(userId); //旷工规则
        // 迟到信息
        var userLate = await this.calcLateInfo(userId, workDay, attendanceInfo, rule, ctx, leaveInfo, businessTripInfo, outInfo);
        // 早退信息
        var userEarly = await this.calcEarlyInfo(userId, workDay, attendanceInfo, rule, ctx, leaveInfo, businessTripInfo, outInfo);
        // 缺卡信息
        var userLack = await this.calcLackInfo(userId, workDay, attendanceInfo, rule, ctx, leaveInfo, businessTripInfo, outInfo);
        // 补卡信息
        var userRetroactive = await this.calcRetroactive(userId, workDay, { attendanceInfo, rule, ctx });
        var absenteeismDays = null;
        var absenteeismDescription = "";
        if (employeeAbsenteeismRules.length != 0) {
            for (const absenteeismRules of employeeAbsenteeismRules) {
                //旷工规则中是否有迟到规则
                if (absenteeismRules.type == "late") {
                    //没有补上班卡
                    if (!userRetroactive.retroactiveWork) {
                        //旷工规则中的迟到规则 大于规则时间 小于规则时间
                        if (absenteeismRules.greater_than <= userLate.lateMinutesWithoutElasticity && userLate.lateMinutesWithoutElasticity <= absenteeismRules.less_than) {
                            absenteeismDays += absenteeismRules.count_absent_date;
                            absenteeismDescription = "根据旷工规则，迟到大于" + absenteeismRules.greater_than + "分钟,小于" + absenteeismRules.less_than + "分钟,记"+absenteeismRules.count_absent_date+"天";
                            continue;
                        }
                        ////旷工规则中的迟到规则 大于规则时间
                        if (absenteeismRules.greater_than <= userLate.lateMinutesWithoutElasticity && !absenteeismRules.less_than) {
                            absenteeismDays += absenteeismRules.count_absent_date;
                            absenteeismDescription = "根据旷工规则，迟到大于" + absenteeismRules.greater_than + "分钟,记"+absenteeismRules.count_absent_date+"天";
                            continue;
                        }
                    }

                }
                //旷工规则中是否有早退规则
                if (absenteeismRules.type == "early") {
                    // 没有补下班卡
                    if (!userRetroactive.retroactiveQuit) {
                        //旷工规则中的早退规则 大于规则时间 小于规则时间 （大于5分钟 小于10）
                        if (absenteeismRules.greater_than <= userEarly.earlyMinutesWithoutElasticity && userEarly.earlyMinutesWithoutElasticity <= absenteeismRules.less_than) {
                            absenteeismDays += absenteeismRules.count_absent_date;
                            absenteeismDescription = absenteeismDescription+"根据旷工规则，早退大于" + absenteeismRules.greater_than + "分钟,小于" + absenteeismRules.less_than + "分钟,记"+absenteeismRules.count_absent_date+"天";
                            continue;
                        }
                        //旷工规则中的早退规则 大于规则时间（大于10分钟）
                        if (absenteeismRules.greater_than <= userEarly.earlyMinutesWithoutElasticity && !absenteeismRules.less_than) {
                            absenteeismDays += absenteeismRules.count_absent_date;
                            absenteeismDescription = absenteeismDescription+"根据旷工规则，早退大于" + absenteeismRules.greater_than + "分钟,记"+absenteeismRules.count_absent_date+"天";
                            continue;
                        }
                    }

                }
                //旷工规则中是否有缺上班卡规则
                if (absenteeismRules.type == "start") {
                    // 没有补上班卡
                    if (!userRetroactive.retroactiveWork) {
                        if (userLack.lackUpWorkCard && !userLack.lackDownWorkCard) {
                            absenteeismDays += absenteeismRules.count_absent_date;
                            absenteeismDescription = absenteeismDescription+"根据旷工规则,缺上班卡，记"+absenteeismRules.count_absent_date+"天"
                            continue;
                        }
                    }

                }
                //旷工规则中是否有缺上班卡规则
                if (absenteeismRules.type == "end") {
                    // 没有补下班卡
                    if (!userRetroactive.retroactiveQuit) {
                        if (userLack.lackDownWorkCard && !userLack.lackUpWorkCard) {
                            absenteeismDays += absenteeismRules.count_absent_date;
                            absenteeismDescription = absenteeismDescription+"根据旷工规则,缺下班卡，记"+absenteeismRules.count_absent_date+"天"
                            continue;
                        }
                    }

                }

                // //旷工规则中是否有缺上下班卡规则(作废)
                // if(absenteeismRules.type == "startandend"){
                //     if(userLack.lackDownWorkCard && userLack.lackUpWorkCard){
                //         absenteeismDays += absenteeismRules.count_absent_date;
                //         continue;
                //     }
                // }
            }
        }



        return {
            absenteeismDays: absenteeismDays, //旷工天数
            absenteeismDescription:absenteeismDescription //旷工说明
        }
    }
}