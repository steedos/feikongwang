const moment = require('moment');
module.exports = {
    /**
     * 请假流程发起审批，如果此假期类型需要维护啊，
     */
    handler: async function (ctx) {
        const { previousDoc, doc } = ctx.params;
        const instance_state = doc.instance_state;
        console.log("请假审批状态",instance_state)
        const { staff, leave_type } = doc;
        const attendanceDate = moment(doc.start);
        const leave_year = attendanceDate.year();
        // 查询考勤规则
        var attendanceRuleSettings = await this.queryAttendanceRules(doc.staff);
        const working_hour = attendanceRuleSettings.daily_hours
        if(!attendanceRuleSettings){
            throw new Error('该员工没有考勤组')
        }
         // 查询假期类型
         const attendanceLeaveType = await this.findAttendanceLeaveType(doc.leave_type);
         // 计算请假时长
        const  totalMinites =  await ctx.call('@steedos-labs/attendance.countTimes', {
            processDoc: {
                "staff": doc.staff,
                "start": doc.start,
                "end": doc.end
            }
        })
        var leaveTimes = totalMinites.data.totalMinites
        if (attendanceLeaveType.minimum_unit === 'day') {
            leaveTimes = leaveTimes / (60 * working_hour)
        }
        if (attendanceLeaveType.minimum_unit === 'hour') {
            leaveTimes = leaveTimes / 60
        }
        const res = await ctx.broker.call('objectql.directUpdate', {
            objectName: 'attendance_leave',
            doc: {
                "days": leaveTimes
            },
            id: doc._id
        })
        // 查询假期类型-查询假期类型的最小单位
        var { minimum_unit, vacation_type } = await this.findAttendanceLeaveType(leave_type);
        // 查询假期余额
        var attendanceBalance = await this.findAttendanceBalance(staff, leave_type,leave_year);
        // 审批状态进行中，冻结请假的时长
        if (previousDoc.instance_state != "pending" && instance_state === "pending") {
            console.log("审批状态进行中") 
            if(attendanceBalance){
                //冻结假期余额
                await this.freezeHolidayBalance(minimum_unit,attendanceRuleSettings.daily_hours,attendanceBalance,doc.days);
            }
        } else if (previousDoc.instance_state != "approved" && instance_state === "approved") {
            console.log("审批状态已核准")
            if(attendanceBalance){
                //审批通过,更新 已用 和冻结
                await this.updateHolidayBalance(minimum_unit,attendanceRuleSettings.daily_hours,attendanceBalance,doc.days);
            }
            // 请假台账结算：
            await ctx.broker.call('@steedos-labs/attendance.leaveSettlement', { // 审批通过，更新每日考勤记录
                leaveId: doc._id
            });

        } else if (instance_state === "rejected" || instance_state === "terminated") { 
            if(attendanceBalance){
               //驳回，需要把之前都冻结的时间还回去
                await this.rejectHolidayBalance(minimum_unit,attendanceRuleSettings.daily_hours,attendanceBalance,doc.days);
            }
        }

    }
}
