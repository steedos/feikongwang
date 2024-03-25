/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-25 09:28:36
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-25 09:29:18
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/crm/src/methods/getNewOpportunityContactRoleOptions.js
 * @Description: 
 */
module.exports = {
    // 计算是否要新建商机联系人角色，以及是否是新建主要角色
    async handler(isLookupOpportunity, isLookupContact, recordOpportunity, recordContact, objOpportunityContactRole) {
        let needAddOpportunityContactRole = false;
        let isPrimaryRole = false;
        if (isLookupOpportunity && isLookupContact) {
            // 商机和联系人都不是新建的
            const roleRecords = await objOpportunityContactRole.find({
                filters: [["opportunity_id", "=", recordOpportunity._id]]
            });
            const repeatRoleRecord = roleRecords.find((item) => {
                return item.contact_id === recordContact._id;
            });
            if (!repeatRoleRecord) {
                // 只有不存在相同联系人的记录时才需要新建联系人角色
                needAddOpportunityContactRole = true;
            }
            if (needAddOpportunityContactRole) {
                const primaryRoleRecord = roleRecords.find((item) => {
                    return item.is_primary === true;
                });
                if (!primaryRoleRecord) {
                    // 只有不存在is_primary为true的记录时才设置当前角色为主要联系人角色
                    isPrimaryRole = true;
                }
            }
        }
        else if (isLookupOpportunity) {
            // 是新建的联系人，但是不是新建的商机
            needAddOpportunityContactRole = true;
            const primaryCount = await objOpportunityContactRole.count({
                filters: [["opportunity_id", "=", recordOpportunity._id], ["is_primary", "=", true]]
            });
            if (primaryCount === 0) {
                // 只有不存在is_primary为true的记录时才设置当前角色为主要联系人角色
                isPrimaryRole = true;
            }
        }
        else if (isLookupContact) {
            // 是新建的商机，但是不是新建的联系人
            needAddOpportunityContactRole = true;
            isPrimaryRole = true;
        }
        else {
            // 是新建的商机和联系人
            needAddOpportunityContactRole = true;
            isPrimaryRole = true;
        }
        return {
            needAddOpportunityContactRole,
            isPrimaryRole
        }
    }
}