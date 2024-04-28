/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-07 10:31:34
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-07 11:54:41
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/actions/attendance_group/attendance_group_trigger.js
 * @Description: 使用触发器校验一个人只能属于一个已启用的考勤规则下的考勤组
 */
const _ = require('lodash');
module.exports = {
    trigger: {
        listenTo: 'attendance_group',
        when: ['beforeInsert', 'beforeUpdate']
    },
    async handler(ctx) {
        const {
            isInsert,
            isUpdate,
            isBefore,
            id,
            doc,
            spaceId,
        } = ctx.params;

        const {
            users = users || [],
        } = doc;

        if (isBefore) {
            if (isInsert) {
                for (const uId of users) {
                    await this.checkUserBelongUniqAttendanceGroup(uId)
                }
            }
            else if (isUpdate) {
                // 计算出新增的用户
                if (users.length > 0) {
                    const currentDoc = await ctx.call('objectql.findOne', {
                        objectName: 'attendance_group',
                        id: id,
                        query: {
                            fields: ['users']
                        }
                    })
                    const currentUsers = currentDoc.users;
                    const newUsers = _.difference(users, currentUsers);
                    for (const uId of newUsers) {
                        await this.checkUserBelongUniqAttendanceGroup(uId)
                    }
                }
            }


        }


    }
}