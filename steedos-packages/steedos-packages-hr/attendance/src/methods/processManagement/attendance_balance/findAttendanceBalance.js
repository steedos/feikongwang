/*
 * @Date: 2023-08-15 17:52:36
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-16 09:13:52  查询假期余额
 */

module.exports = {
    handler: async function (staff,leaveType,leave_year) {
        const broker = this.broker;
        var attendanceBalance = await broker.call("objectql.directFind", {
            objectName: "attendance_balance",
            query: {
                filters: [
                    ["staff", "=", staff],
                    ["leave_type", "=", leaveType],
                    ["leave_year","=",leave_year]
                ],
            },
        });
        return attendanceBalance[0];
    }
}
