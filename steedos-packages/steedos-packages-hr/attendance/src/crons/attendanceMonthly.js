/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-11 13:39:33
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-12 09:35:54
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/crons/attendanceMonthly.js
 * @Description: 设置定时器，每月一号凌晨去创建月度考勤报表
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
const moment =require('moment')
module.exports = {
    name: "createAttendanceMonthly-job",
    cronTime: process.env.STEEDOS_CRON_ATTENDANCE_MONTHLY_SETTLEMENT || '* * 3 1 0/1 *',
    onTick: function () {
        console.log(`定时执行月度考勤结算:${moment().year()}-${moment().month()}`)
        this.call("@steedos-labs/attendance.attendanceMonthly",{
            year: moment().year(),
            month:moment().month(),
        })
        
    },
    runOnInit: function () {
        
    },
    timeZone: 'Asia/Shanghai'
}