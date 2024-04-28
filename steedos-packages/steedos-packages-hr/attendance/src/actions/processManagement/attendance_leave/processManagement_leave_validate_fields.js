const _ = require('lodash')
'use strict';
module.exports = {
    /**
     * 
     * @param {} ctx
     * 新建请假记录之前，如果不在考勤规则，需要提示
     * 如果需要维护假期余额，还要校验假期余额中剩余天数 
     */
    handler: async function (ctx) {
        const doc = ctx.params.doc;
        const leaveTypeId = doc.leave_type;//假期类型id
        const days = doc.days;// 请假的时长
        const staff = doc.staff;// 人员ID；
        const rule = await this.queryAttendanceRules(doc.staff); // 查询考勤规则
        if (rule === null) {
            throw new Error('当前员工不在考勤组没有考勤规则,请将此人员加入某个考勤组内');
        }
        const { daily_hours } = rule;
        if(doc.start>doc.end){
            throw new Error("请确认:请假结束时间要大于请假开始时间")
        }
    // 计算请假时长
     const  totalMinites =  await ctx.call('@steedos-labs/attendance.countTimes', {
            processDoc: {
                "staff": doc.staff,
                "start": doc.start,
                "end": doc.end
            }
        })
        console.log(">>>>>>>>>totalMinites",totalMinites)
        var leaveTimes = totalMinites.data.totalMinites
        // 查询假期类型
        const vacation = await this.findAttendanceLeaveType(leaveTypeId);

        var { minimum_request, minimum_unit, vacation_type, vacation_name, maximum_request } = vacation;
        if (minimum_unit === 'day') {
            leaveTimes = leaveTimes / (60 * daily_hours)
        }
        if (minimum_unit === 'hour') {
            leaveTimes = leaveTimes / 60
        }
        if (maximum_request == 0) {
            maximum_request = -Math.max();
        }
        if (leaveTimes > maximum_request) {
            throw new Error('当前申请假期时长，已超过该假期类型最长请假时长，请修改假期时长后重新提交');
        }
        if (leaveTimes < minimum_request) {
            throw new Error('当前申请假期时长，小于该假期类型最少请假时长，请修改假期时长后重新提交')
        }

        var start = doc.start;
        var  end = doc.end;
        if (!_.isDate(start)) {
            start = new Date(start);
        }
        if (!_.isDate(end)) {
            end = new Date(end);
        }
        const start_year = start.getFullYear();
        const end_year = end.getFullYear();

        console.log(start_year, end_year);

        if (start > end) {
            throw new Error('开始时间和结束时间顺序有问题');
        }

        if (vacation_type.includes('paid') || vacation_type.includes('transfer')) { // 带薪的假期类型和调休假需要维护假期余额
            if (start_year === end_year) {// 没有跨年
                // 查询假期余额
                const attendance_balance = await this.findAttendanceBalance(staff, leaveTypeId, start_year);
                if (attendance_balance) {

                    if (minimum_unit === 'day') {
                        if (leaveTimes > attendance_balance.leave_remain_days) {
                            throw new Error("当前申请的假期时长超过可用假期余额，请修改假期时长后重新提交");
                        }
                    } else if (minimum_unit === 'hour') {
                        if (leaveTimes > attendance_balance.leave_remain_days) {
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