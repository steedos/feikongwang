// 请假审批通过，更新假期余额
module.exports = {
    handler: async function (minimum_unit, working_hour, attendanceBalance, days) {
        var doc = {}
        if (minimum_unit === "day") {
            doc.leave_used_days = attendanceBalance.leave_used_days + days
            doc.freeze_days = attendanceBalance.freeze_days - days
        } else if (minimum_unit === "hour") {
            doc.leave_used_days = attendanceBalance.leave_used_days + days/working_hour
            doc.freeze_days = attendanceBalance.freeze_days - days/working_hour
        }
        console.log("更新假期余额doc", doc);
        await this.broker.call("objectql.directUpdate", {
            objectName: "attendance_balance",
            id: attendanceBalance._id,
            doc,
        });
    }
}