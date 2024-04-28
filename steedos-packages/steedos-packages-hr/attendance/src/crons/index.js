/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-08-11 14:57:32
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-08-11 14:57:42
 * @Description: 
 */

const monthly = require('./attendanceMonthly');
const daily = require('./settlementAttendanceDaily');
module.exports = [
    monthly,
    daily
]