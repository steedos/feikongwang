/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-19 10:20:26
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-21 17:56:16
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/calcLateInfo.js
 * @Description: 实际上班打卡时间>上班应打卡时间
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
        // const { work_start, work_end, space: spaceId, _id: ruleId, rest_start, rest_end, groups ,daily_hours} = rule;
        // 正常上班开始时间
        const workStart = this.generateDateTimeByDateAndTime(workDay, rule.work_start)
        var lateMinutesWithoutElasticity = 0;
        var lateMinutes = 0;
        // TODO method 考虑请假、出差、外出计算出应该上班打卡时间
        var  workStartOfProcess = await this.countWorkStartOfProcess(leaveInfo, businessTripInfo, outInfo, workStart);
        if(workStartOfProcess==null){
            workStartOfProcess = workStart
        }
        console.log("迟到流程-应打卡时间", workStartOfProcess)
        if (attendanceInfo.start) {
            // 上班打卡时间
            var attendanceStart = new Date(attendanceInfo.start)
            const lateness = rule.lateness ? rule.lateness : 0; //允许迟到几分钟
           
            lateMinutesWithoutElasticity = attendanceStart-workStartOfProcess; 
            console.log("迟到流程-应打卡时间", workStartOfProcess)
            console.log("迟到流程-上班打卡时间", attendanceStart) 
            lateMinutes = attendanceStart-workStartOfProcess;
            if (workStartOfProcess == workStart) {   //弹性考勤只考虑正常上班时间
                lateMinutes = lateMinutesWithoutElasticity - lateness
            }
            lateMinutesWithoutElasticity = await this.millisecondToMinites(lateMinutesWithoutElasticity) //转为分钟
            lateMinutes = await this.millisecondToMinites(lateMinutes) //转为分钟
        }else{
            console.log("迟到流程-上班开始时间为空");
        }
        return {
            lateMinutes: lateMinutes <= 0 ? 0 : lateMinutes, // 迟到时长(分钟) 考虑弹性
            start: attendanceStart,// 实际打卡时间
            lateMinutesWithoutElasticity: lateMinutesWithoutElasticity<=0 ? 0 :lateMinutesWithoutElasticity, // 迟到时长(分钟) 不考虑弹性
            workStartOfProcess:workStartOfProcess
        }
    }
}