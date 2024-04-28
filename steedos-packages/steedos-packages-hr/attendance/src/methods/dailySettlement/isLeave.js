/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-04 09:50:56
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-12 12:59:35
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/isLeave.js
 * @Description:
 */
module.exports = {
    /**
     * 判断用户某日是否请假
     * @param {string} userId
     * @param {date} workStart
     * @param {date} workEnd
     * @returns {boolean}
     */
    handler: async function (userId, workStart, workEnd) {
        // 请假台账开始时间小于等于上班开始时间，结束时间大于等于上班结束时间
        const broker = this.broker;
        const leave = await broker.call('objectql.find', {
            objectName: 'attendance_leave',
            query: {
                filters: [
                    ['staff', '=', userId],
                    ['start', '<=', workStart],
                    ['end', '>=', workEnd],
                    ['instance_state', '=', 'approved']
                ]
            }
        })
		if(leave.length > 0){
			return {isLeave:leave.length > 0,leaveId:leave[0]._id};
		}else{
			return {isLeave:leave.length > 0}
		}
    }
}
