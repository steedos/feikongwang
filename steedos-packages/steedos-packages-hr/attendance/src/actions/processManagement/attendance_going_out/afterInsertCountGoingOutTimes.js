// 新增外出记录之后，自动带出时长
module.exports = {
    handler: async function (ctx) {
        const { doc } = ctx.params;
        // 计算出差时长
        const totalMinites = await ctx.call('@steedos-labs/attendance.countTimes', {
            processDoc: {
                "staff": doc.applicant,
                "start": doc.start_time,
                "end": doc.end_time
            }
        })
        // 查询考勤规则
        const queryAttendanceRules = await this.queryAttendanceRules(doc.applicant);
        var days = 0;
        if(queryAttendanceRules){
            const working_hour = queryAttendanceRules.daily_hours
            // 转为小时
            days = totalMinites.data.totalMinites/60
        }
        // 修改出差时长
        const res = await this.broker.call('objectql.directUpdate', {
            objectName: 'attendance_going_out',
            doc: {
                "day": days
            },
            id:doc._id
        })
    }
}