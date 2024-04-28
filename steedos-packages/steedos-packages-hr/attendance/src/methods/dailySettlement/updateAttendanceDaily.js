/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-04 16:25:47
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-04 16:32:12
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance-service/src/methods/dailySettlement/updateAttendanceDaily.js
 * @Description: 
 */
module.exports = {
    handler: async function (id, doc) {
        const result = await this.broker.call('objectql.update', {
            objectName: 'attendance_daily',
            id,
            doc
        })
        console.log("每日考勤情况修改记录",result)
        return result;
    }
}