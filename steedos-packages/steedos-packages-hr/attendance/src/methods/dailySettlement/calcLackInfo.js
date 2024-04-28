/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-19 10:20:26
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-21 17:09:12
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/calcLackInfo.js
 * @Description: 无上班打卡时间 或者 无下班打卡时间
 */
module.exports = {
    handler: async function (userId, workDay, attendanceInfo, // 用户考勤信息，{ start: 实际上班打卡时间, end } 
        rule, // 考勤规则
        ctx,
        leaveInfo, // 请假信息
        businessTripInfo, // 出差信息
        outInfo, // 外出信息
    ) {
        // 正常上班时间
        const workStart = this.generateDateTimeByDateAndTime(workDay, rule.work_start);
        // 正常下班打时间
        const workEnd = this.generateDateTimeByDateAndTime(workDay, rule.work_end);
        // 上班结束打卡时间
        const end_work_clock = this.generateDateTimeByDateAndTime(workDay, rule.end_work_clock);
        // 下班开始打卡时间
        const begins_quit_clock = this.generateDateTimeByDateAndTime(workDay, rule.begins_quit_clock);
        //应上班时间
        var workStartOfProcess = await this.countWorkStartOfProcess(leaveInfo, businessTripInfo, outInfo, workStart);
        console.log("应上班时间", workStartOfProcess)
        //应下班时间
        var workEndOfProcess = await this.countWorkEndOfProcess(leaveInfo, businessTripInfo, outInfo, workEnd);

        console.log("应下班时间", workEndOfProcess)
        var lackUpWorkCard = true;
        var lackDownWorkCard = true;
        if (attendanceInfo.start || workStartOfProcess) {
            lackUpWorkCard = false;
        }
        if (attendanceInfo.end || workEndOfProcess) {
            lackDownWorkCard = false;
        }
        return {
            lackUpWorkCard: lackUpWorkCard,  //缺上班卡
            lackDownWorkCard: lackDownWorkCard, //缺下班卡
        }
    }
}