/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-03 21:05:51
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-07 17:26:00
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/getSettlementScope.js
 * @Description: 返回需要结算的考勤人员ids, 所有启用的考勤规则下的考勤组的考勤人员
 */
'use strict';
/**
返回格式：
[
    {
        _id: ...,
        name: '考勤规则1',
        groups: [attendance_group1, attendance_group2, ...]
    }
]
 */
module.exports = {
    /**
     * 
     * @param {string} userId 可选，如果传入userId，则返回该用户所在的考勤规则
     * @returns 
     */
    handler: async function (userId) {
        const broker = this.broker;
        let rules = []
        if (userId) {
            // 查找用户所在的考勤组
            const group = (await broker.call('objectql.find', {
                objectName: 'attendance_group',
                query: {
                    filters: [
                        ['users', '=', userId]
                    ]
                }
            }))[0];
            group.users = [userId];
            // 查找考勤组所在的考勤规则
            const rule = await broker.call('objectql.findOne', {
                objectName: 'attendance_rule_settings',
                id: group.attendance_rule_settings
            });
            rule.groups = [group];
            rules.push(rule)
        }
        else {
            // 查找所有启用的考勤规则
            rules = await broker.call('objectql.find', {
                objectName: 'attendance_rule_settings',
                query: {
                    filters: [
                        ['status', '=', 'open']
                    ]
                }
            });
            // 查找考勤规则下的考勤组
            for (const rule of rules) {
                const groups = await broker.call('objectql.find', {
                    objectName: 'attendance_group',
                    query: {
                        filters: [
                            ['attendance_rule_settings', '=', rule._id]
                        ]
                    }
                });
                rule.groups = groups;
            }
        }

        return rules;

    }
}