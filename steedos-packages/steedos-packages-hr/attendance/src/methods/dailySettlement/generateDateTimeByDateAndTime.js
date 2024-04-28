/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-04 10:51:46
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-08 15:29:06
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/generateDateTimeByDateAndTime.js
 * @Description: 将日期和时间字段拼接成日期时间
 */
const moment = require('moment');
module.exports = {
    handler: function (date, time) {
        // time 字段类型存在库里就已经自动将时区加8，所以这里需要获取到当前系统运行环境的时区后再减8
        return new Date(moment(date).format('YYYY-MM-DD') + ' ' + moment(time).utcOffset(moment().utcOffset()/60 - 8).format('HH:mm:00'));
    }
}