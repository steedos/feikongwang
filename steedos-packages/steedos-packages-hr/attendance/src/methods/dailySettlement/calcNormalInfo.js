/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-19 10:20:26
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-21 16:47:12
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/calcNormalInfo.js
 * @Description: 
 */
module.exports = {
    handler: async function (userId, workDay, { 
        attendanceInfo, // 用户考勤信息，{ start, end }
        rule, 
        ctx
     }) {
        // 考虑请假、出差、外出
        

        return {
            
        }
    }
}