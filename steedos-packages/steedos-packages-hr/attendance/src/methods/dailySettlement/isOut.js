/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-04 09:55:59
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-12 12:52:17
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/isOut.js
 * @Description:
 */
module.exports = {
    /**
     * 判断用户某日是否外出
     * @param {string} userId
     * @param {date} workStart
     * @param {date} workEnd
     * @returns {boolean}
     */
    handler: async function (userId, workStart, workEnd) {
        // 外出台账开始时间小于等于上班开始时间，结束时间大于等于上班结束时间
        const broker = this.broker;
        const out = await broker.call('objectql.find', {
            objectName: 'attendance_going_out',
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '<=', workStart],
                    ['end_time', '>=', workEnd],
                    ['instance_state', '=', 'approved']
                ]
            }
        })
		console.log('out::',out);
		if(out.length > 0){
			return {isOut:out.length > 0,outId:out[0]._id};
		}else{
			return {isOut:out.length > 0};
		}
    }
}
