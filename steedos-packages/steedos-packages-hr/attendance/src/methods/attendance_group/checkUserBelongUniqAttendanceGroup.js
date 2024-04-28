/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-07 11:50:29
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-07 12:13:45
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/attendance_group/checkUserBelongUniqAttendanceGroup.js
 * @Description: 校验用户是否属于一个已启用的考勤规则下的考勤组
 */
module.exports = {
    handler: async function (uId) {
        // 根据用户id查询用户所属的已启用的考勤组，如果已存在，则不允许添加
        const groups = await this.broker.call('objectql.aggregate', {
            objectName: 'attendance_group',
            query: {},
            externalPipeline: [
                {
                    $match: {
                        users: uId,
                    }
                },
                {
                    $lookup: {
                        from: 'attendance_rule_settings',
                        localField: 'attendance_rule_settings',
                        foreignField: '_id',
                        as: 'rule'
                    }
                },
                {
                    $project: {
                        rule: 1,
                    }
                }
            ]
        })
        for (const group of groups) {
            if (group.rule[0].status === 'open') {
                const user = await this.broker.call('objectql.findOne', {
                    objectName: 'users',
                    id: uId,
                    query: {
                        fields: ['name']
                    }
                })
                throw new Error(`用户${user.name}已属于已启用的考勤规则${group.rule[0].name}下的考勤组，不允许添加`);
            }
        }
    }
}