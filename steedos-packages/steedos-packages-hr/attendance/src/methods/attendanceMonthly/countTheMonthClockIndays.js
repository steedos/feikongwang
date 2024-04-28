/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-09 14:08:06
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-11 17:17:09
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/countTheMonthClockIndays.js
 * @Description: 月度考勤报表-计算考勤月度需打卡多少天
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
const moment = require('moment');
module.exports = {
    handler: async function (date) {
      const attendanceRange = await this.getMonthlyAttendanceRange(date); //获取月度考勤范围
      console.log("考勤范围",attendanceRange);
           //查询节假日-公众假日
        const holidays_PublicHolidays = await this.broker.call(
            'objectql.find',
            {
                objectName: 'holidays',
                query: {
                    filters: [["date", ">=", attendanceRange.startMonthlyDate],["type","=","public"],["date","<",attendanceRange.endMonthlyDate]],
                },
            },
        );
        console.log("该月度的公众节假日天数",holidays_PublicHolidays.length);
        const holidays_PublicHolidaysNumber = holidays_PublicHolidays.length;  //公认节假日天数

           //查询节假日-调配休息日
           const holidays_AllocateRestDays = await this.broker.call(
            'objectql.find',
            {
                objectName: 'holidays',
                query: {
                    filters: [["date", ">=", attendanceRange.startMonthlyDate],["type","=","adjusted_holiday"],["date","<",attendanceRange.endMonthlyDate]],
                },
            },
        );
        console.log("该月度的调配工作日天数",holidays_AllocateRestDays.length);
        const holidays_AllocateRestDaysNumber = holidays_AllocateRestDays.length;  //调配休息日天数


           //查询节假日-调配工作日
           const holidays_AllocationWorkday = await this.broker.call(
            'objectql.find',
            {
                objectName: 'holidays',
                query: {
                    filters: [["date", ">=", attendanceRange.startMonthlyDate],["type","=","adjusted_working_day"],["date","<",attendanceRange.endMonthlyDate]],
                },
            },
        );
        console.log("该月度的调配休息日天数", holidays_AllocationWorkday.length);
        const holidays_AllocationWorkdayNumber = holidays_AllocationWorkday.length;  //调配工作日天数

        const monthWorkings = await this.countTheMonthworking(date); //计算考勤月份中有几个工作日
        console.log("考勤月份中有几个工作日:",monthWorkings);

        const clockInDays = monthWorkings-holidays_PublicHolidaysNumber-holidays_AllocateRestDaysNumber+holidays_AllocationWorkdayNumber  //考勤月份中的工作日天数-公认节假日天数-调配节假日天数+调配节假日天数
        return clockInDays;
    }
}