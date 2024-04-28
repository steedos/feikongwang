/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-07 17:14:26
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-12 17:30:39
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceDaily/originalTimeFormat.js
 * @Description: 获取原始打卡时间的-------  时:分:秒
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
//原始打卡时间（时钟：分钟）
const moment = require('moment');
module.exports = {
    handler: async function (originalDateTime) {
        return moment(originalDateTime).utcOffset(8).format("HH:mm:00")
    }
}