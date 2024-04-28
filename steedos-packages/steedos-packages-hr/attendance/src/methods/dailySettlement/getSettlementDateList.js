/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-07 18:03:54
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-14 13:23:58
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/getSettlementDateList.js
 * @Description:
 */
const _ = require('lodash')
module.exports = {
    /**
     * 获取时间段内的每日结算日期列表
     * @param {date} start
     * @param {date} end
     */
    handler: function (start, end) {
		if(!_.isDate(start)){
			start = new Date(start);
		}
		if(!_.isDate(end)){
			end = new Date(end);
		}
		console.log('start:',start,'end:',end);
        const now = new Date()
        let startDate = null
        let endDate = null
        const dateList = [];
        // 结算日期范围：
        // 1. 结束时间小于等于当前时间，结算范围为开始时间到结束时间
        // 2. 结束时间大于当前时间，且开始时间小于当前时间，结算范围为开始时间到当前时间
        // 3. 开始时间大于当前时间，不结算

        if (end < now) {
            startDate = new Date(start) 
            endDate = new Date(end) 
        }
        else if (end > now && start < now) {
            startDate =new Date(start) 
            endDate = now
        }
        else if (start > now) {
            // DO NOTHING
        }

        if (startDate && endDate) {
            // 根据开始时间和结束时间获取每天的日期
            for (let i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
                console.log('start123:',start,'end123:',end);
                dateList.push(new Date(i));
            }
            console.log('startww:',start,'endww:',end);
        }
        return dateList;
    }
}
