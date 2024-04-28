//查询请假类型
module.exports = {
    handler: async function (leaveType) {
        const broker = this.broker;
        let attendanceLeaveType = await broker.call("objectql.directFind", {
            objectName: "attendance_leave_type",
            query: {
                filters: ["_id", "=", leaveType],
            },
        });
        return attendanceLeaveType[0];
    }
}
