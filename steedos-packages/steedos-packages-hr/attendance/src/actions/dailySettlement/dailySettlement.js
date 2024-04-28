/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-03 19:55:34
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-15 11:01:22
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/actions/dailySettlement/dailySettlement.js
 * @Description: 每日结算，遍历考勤人员，根据当日考勤情况和请假、加班、出差、外出、补卡流程台账维护当日考勤情况（考勤日期为当日的每日考勤情况记录）的考勤状态、旷工（天）、迟到（分钟）、早退（分钟）
 * @Issue: https://gitlab.steedos.cn/chinaums/chinaums-oa-apps/-/issues/38
 */
'use strict';
const _ = require('lodash');
const moment = require('moment')
module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/dailySettlement',
    },
    params: {
        date: {
            type: 'string', // YYYY-MM-DD 格式，如2023-01-01
        },
        userId: {
            type: 'string', // 用户id
            optional: true // 可选参数，如果传了则只结算该用户的考勤情况
        }
    },
    handler: async function (ctx) {
        const { date, userId } = ctx.params;
        const today = new Date(date);
        console.log('today:', today);
        const needSettlement = await this.IfneedSettlement(today);
        console.log("判断今日是否需要结算",needSettlement.ifClockIn)
        if (!needSettlement.ifClockIn) {
            ctx.broker.logger.warn(`${today}不需要结算`)
            return "success"
        }
        // 获取结算范围
        const scope = await this.getSettlementScope(userId);
        for (const rule of scope) {
            const { work_start, work_end, space: spaceId, _id: ruleId, rest_start, rest_end, groups, daily_hours } = rule;
            for (const group of groups) {
                if (userId) {
                    group.users = [userId]
                }
                for (const uId of group.users) {
                    // 查找当日考勤情况
                    const todayAttendanceInfo = await this.getAttendanceByDate(uId, today);
                    // 查询用户信息
                    const suDoc = await this.getSpaceUsers(rule.space, uId);
                    var todayNewAttendanceInfo = "";
                    //没有考勤记录，初始化一条每日考勤
                    if (!todayAttendanceInfo) {
                        const doc = {
                            space: spaceId,
                            company_id: suDoc.company_id,
                            owner: uId,
                            created: new Date(),
                            created_by: uId,
                            modified: new Date(),
                            modified_by: uId,
                            company: suDoc.company_id,
                            date: today,
                            department: suDoc.organization,
                            user: uId,
                        }
                        console.log("doc", doc)
                        // 创建每日考勤
                        await this.createAttendanceDaily(doc);
                        todayNewAttendanceInfo = await this.getAttendanceByDate(uId, today);
                    }
                    if (todayAttendanceInfo) {
                        todayNewAttendanceInfo = todayAttendanceInfo
                    }


                    // 遍历考勤人员，根据当日考勤情况和请假、加班、出差、外出、补卡流程台账维护当日考勤情况
                    // 出差信息
                    var userBusiness = await this.calcBusinessTripInfo(uId, today, { todayNewAttendanceInfo, rule, ctx });
                    // 请假信息
                    var userLeave = await this.calcLeaveInfo(uId, today, { todayNewAttendanceInfo, rule, ctx });
                    // 外出信息
                    var userOut = await this.calcOutInfo(uId, today, { todayNewAttendanceInfo, rule, ctx });
                    // 加班信息
                    var userWorkOvertime = await this.calcWorkOvertimeInfo(uId, today, { todayNewAttendanceInfo, rule, ctx });
                    // 补卡信息
                    var userRetroactive = await this.calcRetroactive(uId, today, { todayNewAttendanceInfo, rule, ctx });
                    console.log("补卡信息", userRetroactive)
                    // 缺卡信息
                    var userLack = await this.calcLackInfo(uId, today, todayNewAttendanceInfo, rule, ctx, userLeave, userBusiness, userOut);
                    console.log("缺卡信息", userLack)
                    // 迟到信息
                    var userLate = await this.calcLateInfo(uId, today, todayNewAttendanceInfo, rule, ctx, userLeave, userBusiness, userOut);
                    // 早退信息
                    var userEarly = await this.calcEarlyInfo(uId, today, todayNewAttendanceInfo, rule, ctx, userLeave, userBusiness, userOut);
                    // 旷工信息
                    var userAbsent = await this.calcAbsentInfo(uId, today, todayNewAttendanceInfo, rule, ctx, userLeave, userBusiness, userOut);
                    console.log("旷工信息", userAbsent)
                  
                

                    const businessTotalHour = await this.minutesTohours(userBusiness.totalMinites);
                    const leaveTotalHour = await this.minutesTohours(userLeave.totalMinites);
                    const outTotalHour = await this.minutesTohours(userOut.totalMinites);
                    const workOvertimeTotalHour = await this.minutesTohours(userWorkOvertime.totalMinites);
                    console.log("出差信息时长", businessTotalHour);
                    console.log("请假信息时长", leaveTotalHour);
                    console.log("外出信息时长", outTotalHour);
                    console.log("加班信息时长", workOvertimeTotalHour);
                    if (todayNewAttendanceInfo) { // 当日有考勤情况
                        const doc = {
                            status: [],
                            going_out: null,
                            annual_leave: null,
                            overtime: null,
                            late: null,
                            leave: null,
                            absent: null,
                            overtime:null,
                            annual_leave:null,
                            business_out:null,
                            business_out_ref:[],
                            going_out:null,
                            going_out_ref:[],
                            leave_ref:[],
                            overtime_ref:[],
                            retroactive_ref:[],
                            remark:"",

                        };
                        // 有出差时长
                        if (businessTotalHour > 0) {
                            doc.business_out = businessTotalHour / rule.daily_hours
                            doc.business_out_ref = userBusiness.ids;
                            doc.status.push("business");
                        }


                        // 有请假时长
                        if (leaveTotalHour > 0) {

                            doc.annual_leave = leaveTotalHour / rule.daily_hours;
                            doc.leave_ref = userLeave.ids;
                            doc.status.push("leave")

                        }
                        //有外出时长
                        if (outTotalHour > 0) {

                            doc.going_out = outTotalHour / rule.daily_hours;
                            doc.going_out_ref = userOut.ids;
                            doc.status.push("out")

                        }
                        //有加班时长
                        if (workOvertimeTotalHour > 0) {
                            doc.overtime = workOvertimeTotalHour;
                            doc.overtime_ref = userWorkOvertime.ids;
                        }

                        //有缺上班卡
                        if (userLack.lackUpWorkCard && !userLack.lackDownWorkCard) {
                            if (userRetroactive.retroactiveWork) {
                                doc.retroactive_ref = userRetroactive.ids
                                doc.remark = "补上班卡"
                            }else{
                                doc.status.push("lack");
                            }

                        }
                        //有缺下班卡
                        if (userLack.lackDownWorkCard && !userLack.lackUpWorkCard) {
                            if (userRetroactive.retroactiveQuit) {
                                doc.retroactive_ref = userRetroactive.ids
                                doc.remark = "补下班班卡"
                            }else{
                                doc.status.push("lack");
                            }

                        }
                        //同时缺上下班卡
                        if (userLack.lackDownWorkCard && userLack.lackUpWorkCard) {
                            if (userRetroactive.retroactiveWork && userRetroactive.retroactiveQuit) {
                                doc.retroactive_ref = userRetroactive.ids
                                doc.remark = "补上下班卡"
                            } else if (userRetroactive.retroactiveWork) {
                                doc.status.push("lack");
                                doc.retroactive_ref = userRetroactive.ids;
                                doc.remark = "补上班卡";

                            } else if (userRetroactive.retroactiveQuit) {
                                doc.status.push("lack")
                                doc.retroactive_ref = userRetroactive.ids;
                                doc.remark = "补下班卡";
                            } else if(businessTotalHour==0 && leaveTotalHour==0 && outTotalHour==0){
                                doc.status.push("absent");
                                doc.absent = 1
                            }

                        }
                        // 弹性考勤判断
                        if (rule.enable_flexible_commuting) {
                            console.log("迟到时间-考勤弹性考勤", userLate.lateMinutes)
                            if (userLate.lateMinutes > 0) {
                                if (userRetroactive.retroactiveWork) {
                                    doc.retroactive_ref = userRetroactive.ids
                                    doc.remark = "补上班班卡"
                                } else {
                                    doc.status.push("late");
                                    doc.late = userLate.lateMinutes;
                                }


                            }
                            if (userEarly.earlyMinutes > 0) {
                                if (userRetroactive.retroactiveQuit) {
                                    doc.retroactive_ref = userRetroactive.ids
                                    doc.remark = "补下班卡"
                                } else {
                                    doc.status.push("early");
                                    doc.leave = userEarly.earlyMinutes;
                                }


                            }
                        } else {
                            console.log("迟到时间-不考勤弹性考勤", userLate.lateMinutesWithoutElasticity)
                            if (userLate.lateMinutesWithoutElasticity > 0) {
                                if (userRetroactive.retroactiveWork) {
                                    doc.retroactive_ref = userRetroactive.ids
                                    doc.remark = "补上班班卡"
                                } else {
                                    doc.status.push("late");
                                    doc.late = userLate.lateMinutesWithoutElasticity;
                                }

                            }
                            if (userEarly.earlyMinutesWithoutElasticity > 0) {
                                if (userRetroactive.retroactiveQuit) {
                                    doc.retroactive_ref = userRetroactive.ids
                                    doc.remark = "补下班卡"
                                } else {
                                    doc.status.push("early");
                                    doc.leave = userEarly.earlyMinutesWithoutElasticity;
                                }

                            }
                        }
                        // 是否旷工
                        if (userAbsent.absenteeismDays > 0) {
                            doc.absent = userAbsent.absenteeismDays
                            if(doc.remark==""){
                                doc.remark = userAbsent.absenteeismDescription
                            }else{
                                doc.remark = doc.remark+userAbsent.absenteeismDescription
                            }
                        }

                       
                        if (doc.status.length == 0) {
                            doc.status.push("normal")
                        }
                        console.log("修改每日考勤数据", doc)
                        // 修改每日考勤
                        await this.updateAttendanceDaily(todayNewAttendanceInfo._id, doc);
                    }

                }
            }

            return 'success'
        }
    }
}

