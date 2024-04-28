module.exports = {
    handler: async function (ctx) {
        console.log('请假记录修改后');
        const { previousDoc, doc, userId } = ctx.params;
        const instance_state = doc.instance_state;
        const leaveType = doc.leaveType;
        const staff = doc.staff;
        const days = doc.days;// 请假时长
        // 考勤规则
        var { working_hour } = await this.queryAttendanceRules(userId);

        if (instance_state === "draft") {

        } else if (instance_state === "pending") {
            const attendanceLeaveType = await this.findAttendanceLeaveType(leaveType);
            console.log('attendanceLeaveType:', attendanceLeaveType);
            const { minimum_unit, vacation_type } = attendanceLeaveType;

            const attendance_balance = await this.findAttendanceBalance(staff, leaveType);
            console.log('pending_attendance_balance:', attendance_balance);
            var { leave_remain_days, freeze_days, _id, leave_used_days } = attendance_balance;

            if (vacation_type.includes("paid")) {// 现在的假期类型需要维护
                if (minimum_unit === "day") {
                    await ctx.broker.call("objectql.directUpdate", {
                        objectName: "attendance_balance",
                        doc: {
                            freeze_days: freeze_days + days,
                            leave_remain_days: leave_remain_days - days,
                        },
                        id: _id,
                    });
                } else if (minimum_unit === "hour") {
                    await ctx.broker.call("objectql.directUpdate", {
                        objectName: "attendance_balance",
                        doc: {
                            freeze_days: freeze_days + days / working_hour,
                            leave_remain_days: leave_remain_days - days / working_hour,
                        },
                        id: _id,
                    });
                }
            }
        } else if (instance_state === "approved") {

            // 请假台账结算：
            await ctx.broker.call('@steedos-labs/attendance.leaveSettlement', {
                leaveId: doc._id
            });

            console.log('请假台账计算');
            console.log('approved');
            const attendanceLeaveType = await this.findAttendanceLeaveType(leaveType);
            const { minimum_unit, vacation_type } = attendanceLeaveType;
            const attendance_balance = await this.findAttendanceBalance(staff, leaveType);
            console.log('approved_attendance_balance', attendance_balance);
            const { leave_remain_days, freeze_days, _id, leave_used_days } = attendance_balance;
            // var leave_remain_days = attendance_balance[0].leave_remain_days,
            //     freeze_days = attendance_balance[0].freeze_days,
            //     _id = attendance_balance[0]._id,
            //     leave_used_days = attendance_balance[0].leave_used_days || 0;

            if (vacation_type.includes("paid")) {
                if (minimum_unit === "day") {
                    await ctx.broker.call("objectql.directUpdate", {// 审批通过,更新已用 和冻结
                        objectName: "attendance_balance",
                        doc: {
                            leave_used_days: leave_used_days + days,
                            freeze_days: freeze_days - days,
                        },
                        id: _id,
                    });
                } else if (minimum_unit === "hour") {
                    // 	// 审批通过
                    await ctx.broker.call("objectql.directUpdate", {
                        objectName: "attendance_balance",
                        doc: {
                            leave_used_days: leave_used_days + days / working_hour,
                            freeze_days: freeze_days - days / working_hour,
                        },
                        id: _id,
                    });
                }
            }
        } else if (instance_state === "rejected" || instance_state === "terminated") { // 将之前冻结的还回去

            console.log('instance_state === "rejected" || instance_state === "terminated")');
            // 根据类型得到最小的单元是天还是小时
            const attendanceLeaveType = await this.findAttendanceLeaveType(leaveType);
            const { minimum_unit, vacation_type } = attendanceLeaveType;
            // let pre_minimum_unit = pre_attendance_leave_type[0].minimum_unit,
            //     pre_vacation_type = pre_attendance_leave_type[0].vacation_type;
            // 之前的假期类型需要维护
            if (vacation_type.includes("paid")) {
                const attendance_balance = await this.findAttendanceBalance(staff, leaveType);
                const { leave_remain_days, freeze_days, _id } = attendance_balance;
                // var pre_leave_remain_days = pre_attendance_balance[0].leave_remain_days,
                //     pre_freeze_days = pre_attendance_balance[0].freeze_days,
                //     pre_id = pre_attendance_balance[0]._id;

                if (minimum_unit === "day") {
                    let updateAttendance = await ctx.broker.call("objectql.directUpdate", {
                        objectName: "attendance_balance",
                        doc: {
                            freeze_days: freeze_days - days,
                            leave_remain_days: leave_remain_days + days,
                        },
                        id: _id,
                    });
                } else if (pre_minimum_unit === "hour") {
                    await ctx.broker.call("objectql.directUpdate", {
                        objectName: "attendance_balance",
                        doc: {
                            freeze_days: freeze_days - days / working_hour,
                            leave_remain_days: leave_remain_days + days / working_hour,
                        },
                        id: _id,
                    });
                }
            }
        }

        // 更新请假对象下的假期余额字段
        await ctx.broker.call("objectql.directUpdate", {
            objectName: "attendance_leave",
            doc: {
                attendance_balance: _id,
            },
            id: doc._id,
        });
    }
}

