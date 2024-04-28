/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-03 22:34:47
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-03 22:37:50
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance-service/src/actions/dailySettlement/healthCheck.js
 * @Description: 
 */
module.exports = {
    rest: {
        method: 'GET',
        fullPath: '/health'
    },
    params: {
    },
    handler: async function (ctx) {
        return this.healthCheck();
    }
}