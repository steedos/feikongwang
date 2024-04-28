/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-07 18:03:54
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-14 13:23:58
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/getSettlementDateList.js
 * @Description:
 */
const _ = require('lodash')
const moment = require('moment');
module.exports = {
    /**
     * 获取时间段内的每日结算日期列表
     * @param {date} start
     * @param {date} end
     */
    handler: function (start, end) {
        let startDate = new Date(start) 
        let endDate = new Date(end)
        const dateList = [];
        const aend = moment(end).utcOffset(8).format('YYYY-MM-DD')
        console.log("aend",aend);
        const astart = moment(start).utcOffset(8).format('YYYY-MM-DD')
        // const endDay = new Date(aend).getDate();
        // const startDay = new Date(astart).getDate();
        const diffDays = moment(aend).diff(moment(astart), 'days');
        if (diffDays >= 0) {
            for (let i = 0; i <= diffDays; i++) {
                 dateList.push(new Date(startDate))
                 startDate.setDate(startDate.getDate() + 1)
            }
        }

        return dateList;
    }
}
