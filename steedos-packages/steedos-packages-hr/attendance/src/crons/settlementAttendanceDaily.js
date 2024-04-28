/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-11 13:39:33
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-12 09:35:54
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/crons/attendanceMonthly.js
 * @Description: 设置定时器，每日凌晨去结算每日考勤报表
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
const moment = require('moment')
console.log("process.env.STEEDOS_CRON_ATTENDANCE_DAILY_SETTLEMENT",process.env.STEEDOS_CRON_ATTENDANCE_DAILY_SETTLEMENT);
module.exports = {
    name: "dailySettlement-job",
    cronTime: process.env.STEEDOS_CRON_ATTENDANCE_DAILY_SETTLEMENT || '0 0 1 * * *',
    onTick: function () {
        console.log(`定时执行每日考勤结算:${moment().subtract(1, 'day').format('YYYY-MM-DD')}`);
        this.call("@steedos-labs/attendance.dailySettlement",{
            date:moment().subtract(1, 'day').format('YYYY-MM-DD')

        })
        
    },
    runOnInit: function () {
        
    },
    timeZone: 'Asia/Shanghai'
}