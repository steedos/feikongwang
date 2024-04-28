/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-11 17:57:31
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-12 10:51:37
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/findAttendanceMonthlyInformation.js
 * @Description: 查询月度考勤报表信息
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (date,userId) {
        const attendanceMonthlyDate = date.substring(0, 7);
        const attendanceMonthlyInformation = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_month',
                query: {
                    fields: ['_id'],
                    filters: [["name", "=",attendanceMonthlyDate],["user","=",userId]],
                },
            },
        );
        return attendanceMonthlyInformation[0];       

    }
}