/**
 * 原始打卡记录：新增记录之前，校验打卡时间是否在打卡范围之内
 */
module.exports = {
    handler: async function (ctx) {
        const { doc } = ctx.params
        console.log("原始打卡记录新增之前", doc);
        // 获取该员工下的考勤规则
        const queryAttendanceRules = await this.queryAttendanceRules(doc.staff);
        //   当天原始打卡的时间
        const originalTime = await this.originalTimeFormat(doc.date_time);
        // 判断当日员工每日考勤是否有记录
        const ifCheckIndata = await this.ifFirstCheckIn(doc.staff, doc.date_time);
        if (queryAttendanceRules) {
            const begins_work_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.begins_work_clock);//上班开始打卡时间
            const end_work_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.end_work_clock);//上班结束打卡时间
            const begins_quit_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.begins_quit_clock); //下班打卡开始时间
            var end_quit_clock = await this.formatAttendanceRulesTime(queryAttendanceRules.end_quit_clock); //下班打卡结束时间
            if (end_quit_clock == "00:00:00") {
                end_quit_clock = "24:00:00";
            }
            if (originalTime >= begins_work_clock && originalTime <= end_work_clock) {
                console.log("原始打卡记录:上班卡")

            } else if (originalTime >= begins_quit_clock && originalTime <= end_quit_clock) {
                console.log("原始打卡记录:下班卡")
            } else {
                throw new Error("还未到打卡时间")
            }
            
            if(ifCheckIndata && originalTime >= begins_work_clock && originalTime <= end_work_clock){
                throw new Error("已经打过上班卡了，请不要重复打卡")
            }
        }
    }
}