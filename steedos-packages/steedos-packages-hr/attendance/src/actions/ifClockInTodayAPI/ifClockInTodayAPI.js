/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-07 17:14:26
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-12 11:57:01
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/actions/ifClockInTodayAPI/ifClockInTodayAPI.js
 * @Description:  
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
//判断当日是否能打卡
const moment = require('moment');
module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/ifClockInToday',
    },
    params: {
       
    },
    handler: async function (ctx) {
        const userSession = ctx.meta.user;
        var today = moment()
        const data = await this.ifClockInTodayAPI(userSession.userId,today);
        return {
            status: 0,
            msg: '',
            data: {
                is_clock_in: data.ifClockIn,
                description: data.description
            }
        }
    }
}