/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-12 15:23:46
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-12 18:10:16
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/processManagement_working/findAttendanceDailyOfUserIdAndApplyDate.js
 * @Description: 根据userId与加班申请日期查询每日考勤情况
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
var moment = require('moment');
module.exports = {
    handler: async function (userId,start) {
        start = moment(start).utcOffset(8).format("YYYY-MM-DD")
        const time =  new Date(start);
        const attendanceDailyInformation = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_daily',
                query: {
                    filters: [["user", "=", userId], ["date", "=", time]]
                },
            },
        );
        console.log("每日考勤情况信息", attendanceDailyInformation[0])

        return attendanceDailyInformation[0];
    }
}