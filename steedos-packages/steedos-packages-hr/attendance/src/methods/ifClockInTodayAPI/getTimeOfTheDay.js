/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-07 17:14:26
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-14 10:38:54
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/ifClockInTodayAPI/getTimeOfTheDay.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
//获取当日时间，时：分：秒
var moment = require('moment');
module.exports = {
    handler: async function () {
        // 获取当前的时间
        const currentTime = moment().utcOffset(8).format('HH:mm:ss');
        console.log("当天的时间",currentTime)
        return currentTime;
        
    }
}