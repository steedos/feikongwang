module.exports = {
    rest: {
        method: 'POST',
        fullPath: '/api/crm/leads/:_id/convert'
    },
    async handler(ctx) {
        const params = ctx.params;
        const recordId = params._id;
        const userSession = ctx.meta.user;
        params.new_account_name = params.new_account_name && params.new_account_name.trim();
        params.new_contact_name = params.new_contact_name && params.new_contact_name.trim();
        params.new_opportunity_name = params.new_opportunity_name && params.new_opportunity_name.trim();
        const objAccounts = this.getObject('accounts');
        const objContacts = this.getObject('contacts');
        const objOpportunity = this.getObject('opportunity');
        let recordAccount, recordContact, recordOpportunity;
        if (params.is_lookup_account && params.lookup_account) {
            recordAccount = await objAccounts.findOne(params.lookup_account);
            if (!recordAccount) {
                throw new Error("Action Failed -- The account is not found.")
            }
        }
        if (params.is_lookup_contact && params.lookup_contact) {
            recordContact = await objContacts.findOne(params.lookup_contact);
            if (!recordContact) {
                throw new Error("Action Failed -- The contact is not found.")
            }
        }
        if (!params.omit_new_opportunity && params.is_lookup_opportunity && params.lookup_opportunity) {
            recordOpportunity = await objOpportunity.findOne(params.lookup_opportunity);
            if (!recordOpportunity) {
                throw new Error("Action Failed -- The opportunity is not found.")
            }
        }
        const validateResult = this.validateBody(params, recordAccount, recordContact, recordOpportunity);
        if (validateResult && validateResult.error) {
            throw new Error(validateResult.error)
        }
        let new_account_name = params.new_account_name;
        let new_contact_name = params.new_contact_name;
        let new_opportunity_name = params.new_opportunity_name;
        const objLeads = this.getObject('leads');
        const record = await objLeads.findOne(recordId);
        const docAccountConverts = this.getDocConverts("accounts", record);
        const docContactConverts = this.getDocConverts("contacts", record);
        const docOpportunityConverts = this.getDocConverts("opportunity", record);
        let docLeadUpdate = { converted: true, status: "Qualified" };
        const baseDoc = { owner: params.record_owner_id, space: userSession.spaceId };
        if (params.is_lookup_account && params.lookup_account) {
            // 所有字段属性都是为空才同步更新
            const docAccountEmptyConverts = this.getDocEmptyConverts(docAccountConverts, recordAccount);
            if (!_.isEmpty(docAccountEmptyConverts)) {
                await objAccounts.updateOne(recordAccount._id, docAccountEmptyConverts, userSession);
            }
        }
        else {
            recordAccount = await objAccounts.insert(Object.assign({}, baseDoc, docAccountConverts, { name: new_account_name }), userSession);
            if (!recordAccount) {
                throw new Error("Action Failed -- Insert account failed.")
            }
        }
        if (recordAccount) {
            docLeadUpdate.converted_account = recordAccount._id;
            if (params.is_lookup_contact && params.lookup_contact) {
                // 包括所属客户在内，所有字段属性都是为空才同步更新
                let docContactEmptyConverts = this.getDocEmptyConverts(Object.assign({}, docContactConverts, { account: recordAccount._id }), recordContact);
                if (params.force_update_contact_lead_source && !docContactEmptyConverts.lead_source && docContactConverts.lead_source) {
                    // 如果界面上勾选了“更新潜在客户来源”，则应该强行更新联系人的潜在客户来源
                    docContactEmptyConverts.lead_source = docContactConverts.lead_source;
                }
                if (!_.isEmpty(docContactEmptyConverts)) {
                    await objContacts.updateOne(recordContact._id, docContactEmptyConverts, userSession);
                }
            }
            else {
                recordContact = await objContacts.insert(Object.assign({}, baseDoc, docContactConverts, { name: new_contact_name, account: recordAccount._id }), userSession);
                if (!recordContact) {
                    throw new Error("Action Failed -- Insert contact failed.")
                }
            }
            if (recordContact) {
                docLeadUpdate.converted_contact = recordContact._id;
                if (!params.omit_new_opportunity) {
                    if (params.is_lookup_opportunity && params.lookup_opportunity) {
                        // 包括所属客户在内，所有字段属性都是为空才同步更新
                        const docOpportunityEmptyConverts = this.getDocEmptyConverts(Object.assign({}, docOpportunityConverts, { account: recordAccount._id }), recordOpportunity);
                        if (!_.isEmpty(docOpportunityEmptyConverts)) {
                            await objOpportunity.updateOne(recordOpportunity._id, docOpportunityEmptyConverts, userSession);
                        }
                    }
                    else {
                        recordOpportunity = await objOpportunity.insert(Object.assign({}, baseDoc, docOpportunityConverts, { name: new_opportunity_name, account: recordAccount._id }), userSession);
                        if (!recordOpportunity) {
                            throw new Error("Action Failed -- Insert opportunity failed.")
                        }
                    }
                }
            }
        }
        await objLeads.updateOne(recordId, docLeadUpdate, userSession);

        return { state: 'SUCCESS' }
    }
}