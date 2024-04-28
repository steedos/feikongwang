/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-03 19:55:34
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-16 16:02:07
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/actions/dailySettlement/leaveSettlement.js
 * @Description: 请假流程审批通过后结算每日考勤情况
 * @Issue: https://gitlab.steedos.cn/chinaums/chinaums-oa-apps/-/issues/30
 */
'use strict';
const _ = require('lodash');
const moment = require('moment');
module.exports = {
    handler: async function (ctx) {
        const { leaveId } = ctx.params;

        // 获取请假台账
        const leave = await ctx.call('objectql.findOne', {
            objectName: 'attendance_leave',
            id: leaveId,
        })
        if (!leave) {
            throw new Error('请假台账不存在');
        }

        const { staff: userId, start, end } = leave;

        const dateList = this.getSettlementDateList(start, end);
        console.log("dateList",dateList)

        // 计算每天的考勤情况
        for (const date of dateList) {
            console.log("结算日期",date)
            await ctx.call('@steedos-labs/attendance.dailySettlement', {
                userId,
                date: moment(date).utcOffset(8).format('YYYY-MM-DD')
            })
        }

        return 'success'

    }
}
