/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-09 11:52:31
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-12 10:07:00
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/actions/attendanceMonthly/attendanceMonthly.js
 * @Description: 月度考勤报表
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
'use strict';
module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/attendanceMonthly',
    },
    params: {
        year: {
            type: 'string',
        },
        month: {
            type: 'string',
        },

        userId: {
            type: 'string', // 用户id
            optional: true // 可选参数，如果传了则只结算该用户的考勤情况
        }


    },
    handler: async function (ctx) {
        const { year, month, userId } = ctx.params;
        let userIds = null;
        const date = `${year}-${month}-01`;
        const theMonthClockIndays = await this.countTheMonthClockIndays(date);  //查询节假日，计算该月需打卡多少天
        console.log("该月需打卡多少天", theMonthClockIndays)
        if (userId) {
            userIds = [userId]
        } else {
            userIds = await this.getUsers();             //查询已启用的考勤规则下的考勤组下的员工信息
        }
        const createAttendanceMonthly = await this.createAttendanceMonthly(userIds, date, theMonthClockIndays);  //创建月度考勤报表

    }
}