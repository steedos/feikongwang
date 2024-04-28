/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-12 13:45:25
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-14 11:24:29
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/actions/processManagement_working/processManagement_working.js
 * @Description: 流程管理-加班
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
'use strict';
const _ = require('lodash');
const moment = require('moment');
module.exports = {
    handler: async function (ctx) {
        const workOvertimeId = ctx.params.workOvertimeId;

        // 获取加班台账
        const workOvertimeTrip = await ctx.call('objectql.findOne', {
            objectName: 'attendance_overtime',
            id: workOvertimeId,
        })
        console.log(">>>>>>>>>>>>>加班", workOvertimeTrip)
        if (!workOvertimeTrip) {
            throw new Error('加班台账不存在');
        }
        // 加班审批通过后，假期余额（调休假维护）
        await this.attendanceOvertimeOfAttendanceBalance(workOvertimeTrip);

        const { staff: userId, start: start, end: end } = workOvertimeTrip;

        const attendanceDate = moment(start).utcOffset(8).format('YYYY-MM-DD')
        // 判断是否是工作日
        const needSettlement = await this.IfneedSettlement(attendanceDate);
        if (needSettlement.ifClockIn) {
            await ctx.call('@steedos-labs/attendance.dailySettlement', {
                userId,
                date: attendanceDate
            })
        } else {
            // 周六、周天加班
            //判断当日员工每日考勤是否有记录
            const attendanceDaily = await this.findAttendanceDailyOfUserIdAndApplyDate(userId, start);
            if (attendanceDaily) {
                // 修改每日考勤的加班信息
                await this.updateAttendanceDailyInformation(workOvertimeTrip, attendanceDaily);
            } else {
                // 新增每日考勤信息
                await this.createAttendanceDailyInformation(workOvertimeTrip);
            }

        }



        return 'success'

    }
}




