/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-08 09:51:27
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-16 18:11:53
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/actions/dailySettlement/retroactiveSettlement.js
 * @Description: 补卡台账审批通过后结算
 */

'use strict';
const _ = require('lodash');
const moment = require('moment');
module.exports = {

    handler: async function (ctx) {
        const { retroactiveId } = ctx.params;
        console.log("补卡台账审批通过后结算", retroactiveId)
        // 获取补卡台账
        const retroactive = await ctx.call('objectql.findOne', {
            objectName: 'attendance_retroactive',
            id: retroactiveId,
        })
        console.log("补卡信息", retroactive)
        if (!retroactive) {
            throw new Error('补卡台账不存在');
        }

        const { staff: userId, start, end } = retroactive;
        var date = null
        if (start) {
            date = start
        } else if (end) {
            date = end
        }
        // 计算每天的考勤情况
        await ctx.call('@steedos-labs/attendance.dailySettlement', {
            userId,
            date: moment(date).utcOffset(8).format('YYYY-MM-DD')
        })


        return 'success'

    }
}
