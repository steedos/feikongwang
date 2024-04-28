//判断是否有假期类型中是否有调休假
module.exports = {
    handler: async function () {
        const broker = this.broker;
        let attendanceLeaveType = await broker.call("objectql.find", {
            objectName: "attendance_leave_type",
            query: {
                filters: ["vacation_type", "=", "transfer_leave"],
            },
        });
        return attendanceLeaveType[0];
    }
}