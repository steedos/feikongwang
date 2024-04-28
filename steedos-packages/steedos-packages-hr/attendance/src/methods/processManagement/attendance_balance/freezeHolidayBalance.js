// 冻结假期余额
module.exports = {
    handler: async function (minimum_unit, working_hour, attendanceBalance, days) {
        var doc = {}
        if (minimum_unit === "day") {
            doc.freeze_days = attendanceBalance.freeze_days + days
            doc.leave_remain_days = attendanceBalance.leave_remain_days - days
        } else if (minimum_unit === "hour") {
            doc.freeze_days = attendanceBalance.freeze_days + days / working_hour
            doc.leave_remain_days = attendanceBalance.leave_remain_days - days / working_hour
        }
        console.log("冻结假期余额doc", doc);
       const a= await this.broker.call("objectql.directUpdate", {
            objectName: "attendance_balance",
            id: attendanceBalance._id,
            doc,
        });
        console.log("冻结假期余额",a)
    }
}
