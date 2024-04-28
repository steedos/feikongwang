// 修改关于调休假的假期余额
module.exports = {
    handler: async function (attendanceBalanceInformation,workOvertimeTrip,working_hour) {

          await this.broker.call("objectql.update", {
            objectName: "attendance_balance",
            doc: {
                "leave_days":attendanceBalanceInformation.leave_days+workOvertimeTrip.hours/working_hour,
                "leave_remain_days":attendanceBalanceInformation.leave_days+workOvertimeTrip.hours/working_hour,
                
            },
            id: attendanceBalanceInformation._id
        });
    }
}