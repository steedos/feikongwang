/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-19 10:20:26
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-21 17:57:43
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/calcEarlyInfo.js
 * @Description: 实际下班打卡时间<下班应打卡时间
 */
module.exports = {
    handler: async function (userId, workDay,
        attendanceInfo, // 用户考勤信息，{ start: 实际上班打卡时间, end }
        rule, // 考勤规则
        ctx,
        leaveInfo, // 请假信息
        businessTripInfo, // 出差信息
        outInfo, // 外出信息
    ) {
        // 正常下班开始时间
        const workEnd = this.generateDateTimeByDateAndTime(workDay, rule.work_end);
        if(attendanceInfo.end){
        // TODO method 考虑请假、出差、外出计算出应下班打卡时间
        var workEndOfProcess = await this.countWorkEndOfProcess(leaveInfo, businessTripInfo, outInfo, workEnd);
        if(workEndOfProcess==null){
            workEndOfProcess = workEnd
        }
        var earlyMinutes = 0;
        var earlyMinutesWithoutElasticity = 0;
        const early = rule.early ? rule.early : 0; //允许早退几分钟
        // 下班打卡时间
        var attendanceEnd = new Date(attendanceInfo.end)
        earlyMinutesWithoutElasticity = workEndOfProcess - attendanceEnd;
        earlyMinutes = workEndOfProcess - attendanceEnd;
        if (workEndOfProcess == workEnd) {   //弹性考勤只考虑正常下班时间
            earlyMinutes = earlyMinutesWithoutElasticity - early
        }
        earlyMinutesWithoutElasticity = await this.millisecondToMinites(earlyMinutesWithoutElasticity)
        earlyMinutes = await this.millisecondToMinites(earlyMinutes) //转为分钟
    }else{
        console.log("早退流程-下班时间为空")
    }
        return {
            earlyMinutes: earlyMinutes <= 0 ? 0 : earlyMinutes, // 早退时长(分钟) 考虑弹性
            end: attendanceEnd,   // 实际打卡时间
            earlyMinutesWithoutElasticity: earlyMinutesWithoutElasticity <= 0 ? 0 : earlyMinutesWithoutElasticity, // 早退时长(分钟) 不考虑弹性
            workEndOfProcess:workEndOfProcess
        }
    }
}