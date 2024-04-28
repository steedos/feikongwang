/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-04 15:14:46
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-06 13:07:04
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance-service/src/methods/dailySettlement/getDiffMinutes.js
 * @Description: 
 */
const moment = require('moment');
module.exports = {
    /**
     * 比较两个日期的分钟差
     * @param {date} date1 
     * @param {date} date2 
     */
    handler: function (date1, date2) {
        const m1 = moment(date1);
        const m2 = moment(date2);
        return m1.diff(m2, 'minutes');
    }
}