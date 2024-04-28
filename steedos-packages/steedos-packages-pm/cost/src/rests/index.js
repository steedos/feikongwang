/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-20 13:27:06
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 17:03:52
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/cost/src/rests/index.js
 * @Description: 
 */
module.exports = {
    api_cost_statistic_trend: require('./api_cost_statistic_trend.js'),
    ...require('./cost_schedule_reimburse_detail.js')
}