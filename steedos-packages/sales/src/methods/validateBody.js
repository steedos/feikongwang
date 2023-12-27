/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-25 09:30:42
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-25 09:31:12
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/crm/src/methods/validateBody.js
 * @Description: 
 */
module.exports = {
    handler(body, recordAccount, recordContact, recordOpportunity) {
        let validateResult = {};
        if (body.is_lookup_account && !body.lookup_account) {
            validateResult.error = "请输入“新建客户名称”或选择“现有客户”!";
        }
        else if (!body.is_lookup_account && !body.new_account_name) {
            validateResult.error = "请输入“新建客户名称”或选择“现有客户”!";
        }
        else if (body.is_lookup_contact && !body.lookup_contact) {
            validateResult.error = "请输入“新建联系人名称”或选择“现有联系人”!";
        }
        else if (!body.is_lookup_contact && !body.new_contact_name) {
            validateResult.error = "请输入“新建联系人名称”或选择“现有联系人”!";
        }
        else if (!body.omit_new_opportunity) {
            if (body.is_lookup_opportunity && !body.lookup_opportunity) {
                validateResult.error = "请选择“现有业务机会”或勾选“请勿在转换时创建业务机会”项!";
            }
            else if (!body.is_lookup_opportunity && !body.new_opportunity_name) {
                validateResult.error = "请输入“新建业务机会名称”或勾选“请勿在转换时创建业务机会”项!";
            }
        }
        if (!validateResult.error && recordAccount) {
            if (recordContact && recordContact.account && recordContact.account !== recordAccount._id) {
                validateResult.error = "现有联系人必须是现有客户下的联系人!";
            }
            else if (recordOpportunity && recordOpportunity.account && recordOpportunity.account !== recordAccount._id) {
                validateResult.error = "现有业务机会必须是现有客户下的业务机会!";
            }
        }
        return validateResult;
    }
}