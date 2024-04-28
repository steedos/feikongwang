module.exports = {
    trigger: {
        listenTo: 'cost_loan_detail',
        when: [
            'afterInsert',
            'afterDelete'
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;

        if (isAfter) {
            //与核销费用明细中添加费用逻辑冲突（生成两条数据）
            // if (isInsert) {
            //     let this_query = {
            //         fields: ['applicant', 'department'],
            //     };
            //     // 借款核销单
            //     let cost = await this.getObject('cost_business_loan_reimburse').findOne(doc.daily_expense, this_query);

            //     let instance = {};
            //     instance.o = "cost_business_loan_reimburse";
            //     instance.ids = [doc.daily_expense];

            //     let costData = {};
            //     costData.o = "cost_loan_detail";
            //     costData.ids = [doc._id];

            //     let insertDoc = {};
            //     insertDoc.amount = doc.amount || 0;
            //     insertDoc.instance = instance;
            //     insertDoc.cost = costData;
            //     insertDoc.instance_state = "";
            //     insertDoc.expend_type = doc.expend_type || "";
            //     insertDoc.date = doc.date;
            //     insertDoc.applicant = cost.applicant;
            //     insertDoc.department = cost.department;
            //     insertDoc.space = doc.space;
            //     insertDoc.owner = doc.owner;
            //     insertDoc.created_by = doc.created_by;
            //     insertDoc.modified_by = doc.modified_by;
            //     insertDoc.company_id = doc.company_id;
            //     insertDoc.company_ids = doc.company_ids;
            //     insertDoc.remark = doc.remark || "";

            //     await this.getObject('cost_reimburse_detail').insert(insertDoc);
            // }

            if (isDelete) {
                let this_query = {
                    filters: [["cost.o", "=", "cost_loan_detail"], ["cost.ids", "=", previousDoc._id]]
                };

                await this.getObject('cost_reimburse_detail').directDelete(this_query);
            }
        }
    }
}

/**
 * const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'cost_loan_detail',

    beforeInsert: async function(){
    },

    beforeUpdate: async function(){
    },

    afterInsert: async function(){
        let doc = this.doc;

        let this_query = {
            fields: ['applicant', 'department'],
        };
        // 借款核销单
        let cost = await objectql.getObject('cost_business_loan_reimburse').findOne(doc.daily_expense, this_query);

        let instance = {};
        instance.o = "cost_business_loan_reimburse";
        instance.ids = [doc.daily_expense];

        let costData = {};
        costData.o = "cost_loan_detail";
        costData.ids = [doc._id];

        let insertDoc = {};
        insertDoc.amount = doc.amount || 0;
        insertDoc.instance = instance;
        insertDoc.cost = costData;
        insertDoc.instance_state = "";
        insertDoc.expend_type = doc.expend_type || "";
        insertDoc.date = doc.date;
        insertDoc.applicant = cost.applicant;
        insertDoc.department = cost.department;
        insertDoc.space = doc.space;
        insertDoc.owner = doc.owner;
        insertDoc.created_by = doc.created_by;
        insertDoc.modified_by = doc.modified_by;
        insertDoc.company_id = doc.company_id;
        insertDoc.company_ids = doc.company_ids;
        insertDoc.remark = doc.remark || "";

        await objectql.getObject('cost_reimburse_detail').insert(insertDoc);

    },

    afterUpdate: async function(){
    },

    afterDelete: async function(){
        let doc = this.previousDoc;

        let this_query = {
            filters: [["cost.o", "=", "cost_loan_detail"],["cost.ids", "=", doc._id]]
        };

        await objectql.getObject('cost_reimburse_detail').directDelete(this_query);
    },

}
 */