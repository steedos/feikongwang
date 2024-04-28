/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-09 15:55:20
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-11 17:18:46
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getMonthlyAttendanceRange.js
 * @Description: 获取月度考勤范围
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
const moment = require('moment');
module.exports = {
    handler: async function (date) {       
        const currentDate = moment(date).format('YYYY-MM-DD');
        const startMonthlyDate = new Date(currentDate);
        const startdate = moment(startMonthlyDate);
        const endDate = startdate.add(1, 'months');
        const endMonthlyDate = new Date(endDate);
        return {
            "startMonthlyDate":startMonthlyDate,
            "endMonthlyDate":endMonthlyDate
        }
        
    }
}