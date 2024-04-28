//新增加班记录之后，自动带出假期余额
const moment = require('moment');
module.exports = {
    handler: async function (ctx) {
        const doc = ctx.params.doc;
         //获取该员工下的考勤规则
        const queryAttendanceRules = await this.queryAttendanceRules(doc.staff); 
        const working_hour = queryAttendanceRules.daily_hours
        console.log("working_hour",working_hour)
        // 查询假期类型判断是否有调休假
        const ifHaveTransferLeave = await this.ifHaveTransferLeave()
        if (ifHaveTransferLeave) {
            // 根据假期类型id，查询假期余额
            var attendanceBalance = await this.broker.call("objectql.find", {
                objectName: "attendance_balance",
                query: {
                    filters: [
                        ["leave_type", "=", ifHaveTransferLeave._id],
                        ["staff", "=", doc.staff]
                    ]
                },
            });
            if (attendanceBalance.length>0) {
                // 加班对象插入假期余额id
                var attendanceLeave = await this.broker.call("objectql.directUpdate", {
                    objectName: "attendance_overtime",
                    doc: {
                        "attendance_balance": attendanceBalance[0]._id,
                    },
                    id: doc._id,
                });
            }
        }


    }
}