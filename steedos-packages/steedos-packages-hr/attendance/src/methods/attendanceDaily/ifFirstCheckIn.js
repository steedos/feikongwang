/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-12 15:06:00
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-12 17:15:33
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceDaily/ifFirstCheckIn.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
//判断员工当日每日考勤是否有数据
const moment = require('moment');
module.exports = {
    handler: async function (userId,originalDateTime) {
        const currentDate = moment(originalDateTime).utcOffset(8).format('YYYY-MM-DD');
        const newTime = new Date(currentDate);
        console.log("判断员工当日每日考勤是否有数据Date",newTime)
        const ifUserFirstCheckIn = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_daily',
                query: {
                    filters: [["user", "=", userId], ["date", "=", newTime]]
                },
            },
        );
        console.log("ifUserFirstCheckIn", ifUserFirstCheckIn[0])

        return !!ifUserFirstCheckIn[0];
    }
}