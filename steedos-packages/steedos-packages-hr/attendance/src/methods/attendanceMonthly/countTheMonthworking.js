/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-09 16:30:51
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-11 17:12:46
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/countTheMonthworking.js
 * @Description: 计算月度考勤的月份中有几个工作日
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
const moment = require('moment');
module.exports = {
    handler: async function (date) {
        const attendanceDate = moment(date, 'YYYY-MM-DD');
        const year = attendanceDate.year();
        const month = attendanceDate.month() + 1;
        console.log("月度考勤年份", year)
        console.log("月度考勤月份", month)
        const totalDays = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth(); // 获取该月的总天数
        console.log("月度考勤中月份的总天数", totalDays)
        let workingDays = 0; // 工作日计数器

        for (let i = 1; i <= totalDays; i++) {
            const date = moment(`${year}-${month}-${i}`, 'YYYY-MM-DD');
            month_date = new Date(date);
            if (date.weekday() !== 0 && date.weekday() !== 6) {      //0:表示星期日 6:表示星期六
                workingDays++; // 是工作日则计数加1
            }
        }

        return workingDays;


    }
}