/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-07 17:56:02
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-16 16:01:26
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/actions/dailySettlement/outSettlement.js
 * @Description: 外出结算
 */
'use strict';
const _ = require('lodash');
const moment = require('moment');
module.exports = {
    handler: async function (ctx) {
        const  outId  = ctx.params.outId;
        console.log("外出台账id",outId)
        // 获取外出台账
        const out = await ctx.call('objectql.findOne', {
            objectName: 'attendance_going_out',
            id: outId,
        })
        if (!out) {
            throw new Error('外出台账不存在');
        }

        const { applicant: userId, start_time: start, end_time: end } = out;

        const dateList = this.getSettlementDateList(start, end);

        // 计算每天的考勤情况
        for (const date of dateList) {
            await ctx.call('@steedos-labs/attendance.dailySettlement', {
                userId,
                date: moment(date).utcOffset(8).format('YYYY-MM-DD')
            })
        }

        return 'success'

    }
}
