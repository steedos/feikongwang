//查询考勤规则
module.exports = {
    handler: async function (userId) {
        //查询考勤组
        const attendanceRuleSettingsId = await this.broker.call(
            'objectql.find',
            {
                objectName: 'attendance_group',
                query: {
                    filters: ["users", "contains", userId],  // 过滤条件： 所有者为当前用户                           
                },
            },
        );
        
        if (attendanceRuleSettingsId[0] == undefined) {
            throw new Error("该员工还没加入考勤组,请联系管理员")
        } else {
            console.log("该用户有考勤组")
            console.log(attendanceRuleSettingsId[0].attendance_rule_settings)
            //查询该用户下考勤组的考勤规则
            const attendanceRuleSettings = await this.broker.call(
                'objectql.find',
                {
                    objectName: 'attendance_rule_settings',
                    query: {
                        filters: [["_id", "=", attendanceRuleSettingsId[0].attendance_rule_settings],["status", "=", "open"]],                           
                    },
                },
            );
            if(!attendanceRuleSettings[0]){
                throw new Error("考勤组未设置考勤规则，请联系管理员")
            }
            return attendanceRuleSettings[0];
        }

    }
}