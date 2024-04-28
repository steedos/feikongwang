/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-04 09:56:23
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-12 12:51:10
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/isBusinessTrip.js
 * @Description:
 */
module.exports = {
    /**
     * 判断用户某日是否出差
     * @param {string} userId
     * @param {date} workStart
     * @param {date} workEnd
     * @returns {boolean}
     */
    handler: async function (userId, workStart, workEnd) {
        // 出差台账开始时间小于等于上班开始时间，结束时间大于等于上班结束时间
        const broker = this.broker;
        const business = await broker.call('objectql.find', {
            objectName: 'attendance_business_out',
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '<=', workStart],
                    ['end_time', '>=', workEnd],
                    ['instance_state', '=', 'approved']
                ]
            }
        })
		if(business.length > 0){
			return {isBusinessTrip:business.length > 0,businessId:business[0]._id};
		}else{
			return {isBusinessTrip:business.length > 0};
		}

    }
}
