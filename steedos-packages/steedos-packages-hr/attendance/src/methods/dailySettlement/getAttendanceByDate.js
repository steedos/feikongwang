/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-03 21:27:21
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-08 19:55:23
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/getAttendanceByDate.js
 * @Description: 查找当日考勤情况
 */
'use strict';
module.exports = {
    handler: async function (userId, date) {
        const todayAtt = (await this.broker.call('objectql.find', {
            objectName: 'attendance_daily',
            query: {
                filters: [
                    ['user', '=', userId],
                    ['date', '=', date]
                ]
            }
        }))[0]
        return todayAtt;
    }
}