//新增请假记录后，自动带出假期余额
module.exports = {
    handler: async function (ctx) {
        const doc = ctx.params.doc;

        // 获取该员工下的考勤规则
        const queryAttendanceRules = await this.queryAttendanceRules(doc.staff);
        // 每日工作时长 
        const working_hour = queryAttendanceRules.daily_hours
        //查询假期类型
        var attendanceLeaveType = await this.broker.call("objectql.find", {
            objectName: "attendance_leave_type",
            query: {
                filters: ["_id", "=", doc.leave_type]
            },
        });
        // 计算请假时长
        const totalMinites = await ctx.call('@steedos-labs/attendance.countTimes', {
            processDoc: {
                "staff": doc.staff,
                "start": doc.start,
                "end": doc.end
            }
        })
        console.log("计算请假时长",totalMinites)
        var leaveTimes = totalMinites.data.totalMinites
        if (attendanceLeaveType[0].minimum_unit === 'day') {
            leaveTimes = leaveTimes / (60 * working_hour)
        }
        if (attendanceLeaveType[0].minimum_unit === 'hour') {
            leaveTimes = leaveTimes / 60
        }
        const res = await ctx.broker.call('objectql.directUpdate', {
            objectName: 'attendance_leave',
            doc: {
                "days": leaveTimes
            },
            id: doc._id
        })
        if (attendanceLeaveType[0].vacation_type == "paid_annual_leave" || attendanceLeaveType[0].vacation_type == "paid_sick_leave" || attendanceLeaveType[0].vacation_type == "transfer_leave") {
            // 根据假期类型id，查询假期余额
            var attendanceBalance = await this.broker.call("objectql.find", {
                objectName: "attendance_balance",
                query: {
                    filters: [
                        ["leave_type", "=", doc.leave_type],
                        ["staff", "=", doc.staff]
                    ]
                },
            });
            // 插入请假对象插入假期余额id
            var attendanceLeave = await this.broker.call("objectql.update", {
                objectName: "attendance_leave",
                doc: {
                    "attendance_balance": attendanceBalance[0]._id,
                },
                id: doc._id,
            });
        }

    }
}