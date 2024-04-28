module.exports = {
    trigger: {
        listenTo: 'cost_personal_repayment', // 还款
        when: [
            'afterUpdate',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;

        if (isAfter) {

            if (isUpdate) {

                if (doc.personal_loan && (doc.instances && doc.instances[0].state == "approved")) {
                    let this_query = {
                        fields: ['remaining_amount'],
                    };

                    let personal_loan = await this.getObject('cost_personal_loan').findOne(doc.personal_loan, this_query)
                    if (personal_loan.remaining_amount == 0) {
                        await this.getObject('cost_personal_loan').directUpdate(doc.personal_loan, { "state": "已还款" })
                    }
                }
            }
        }
    }
}

/**
 * const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'cost_personal_repayment',

    beforeInsert: async function(){
    },

    beforeUpdate: async function(){
    },

    afterInsert: async function(){
    },

    afterUpdate: async function(){
        let doc = this.doc;

        if (doc.personal_loan && (doc.instances && doc.instances[0].state == "approved")){
            let this_query = {
                fields: ['remaining_amount'],
            };

            let personal_loan = await objectql.getObject('cost_personal_loan').findOne(doc.personal_loan, this_query)
            if (personal_loan.remaining_amount == 0){
                await objectql.getObject('cost_personal_loan').directUpdate(doc.personal_loan, {"state": "已还款"})
            }
        }

    },

    afterDelete: async function(){
    },

}
 */