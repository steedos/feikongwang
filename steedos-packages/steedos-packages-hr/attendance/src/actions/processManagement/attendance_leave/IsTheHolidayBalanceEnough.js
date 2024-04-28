// 修改请假记录，校验假期余额是否足够
var moment = require('moment');
module.exports = {
    handler: async function (ctx) {
        const attendanceleaveId = ctx.params.attendanceleaveId; 
        console.log("请假信息id",attendanceleaveId)
        console.log("请假对象修改之前")
        //查询请假信息
        const leaveInfermation = await ctx.broker.call(
            'objectql.directFind',
            {
                objectName: 'attendance_leave',
                query: {
                    filters: ['_id', '=', attendanceleaveId]
                }
            }
        );
        console.log("请假信息",leaveInfermation)
        //查询考勤规则信息
       const rule_settings =  await this.queryAttendanceRules(leaveInfermation[0].staff);
       console.log("考勤规则信息",rule_settings);
        var working_hour = rule_settings.daily_hours;
        //查询假期类型信息
        const vacation =  await this.findAttendanceLeaveType(leaveInfermation[0].leave_type);
        if(vacation.maximum_request == 0 || !vacation.maximum_request){
            vacation.maximum_request =  -Math.max();
        }
        console.log("假期类型信息",vacation);
        if (leaveInfermation[0].days > vacation.maximum_request) {
            throw new Error('当前申请假期时长，已超过该假期类型最长请假时长，请修改假期时长后重新提交')
        }

        if (leaveInfermation[0].days < vacation.minimum_request) {
            throw new Error('当前申请假期时长，小于该假期类型最少请假时长，请修改假期时长后重新提交')
        }

        const start_year = leaveInfermation[0].start.getFullYear();
        const end_year = leaveInfermation[0].end.getFullYear();

        console.log(start_year, end_year);

        if (start_year > end_year) {
            throw new Error('开始时间和结束时间顺序有问题');
        }

        if (vacation.vacation_type.includes('paid') || vacation.vacation_type.includes('transfer')) { // 带薪的假期类型和调休假需要维护假期余额
            if (start_year === end_year) {// 没有跨年
                // 查询假期余额
                const attendance_balance = this.findAttendanceBalance(leaveInfermation[0].staff, leaveInfermation[0].leave_type, start_year);
                if (attendance_balance.length !== 0) {
                    const { leave_remain_days } = attendance_balance;

                    if (vacation.minimum_unit === 'day') {

                        if (leaveInfermation[0].days > leave_remain_days) {
                            throw new Error("当前申请的假期时长超过可用假期余额，请修改假期时长后重新提交");
                        }
                    } else if (vacation.minimum_unit === 'hour') {
                        if (leaveInfermation[0].days / working_hour > leave_remain_days) {
                            throw new Error("当前申请的假期时长超过可用假期余额，请修改假期时长后重新提交");
                        }
                    }
                } else {
                    throw new Error('当前用户本年度没有该类型的假期余额，请联系人事');
                }

            } else {// 跨年
                throw new Error('跨年类型的假期，需分开请');
            }
        }

    }
}
