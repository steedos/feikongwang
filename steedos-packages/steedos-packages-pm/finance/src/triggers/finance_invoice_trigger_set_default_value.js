module.exports = {
    trigger: {
        listenTo: 'finance_invoice',
        when: [
            'beforeInsert',
            'beforeUpdate',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;
        if (isBefore) {
            if (isInsert) {
                if (doc.contract) {
                    let this_contract = await this.getObject('contracts').find({ filters: [['_id', '=', doc.contract]] });
                    if (this_contract[0].project) {
                        doc.project = this_contract[0].project;
                    }
                    if (this_contract[0].amount_type) {
                        doc.amount_type = this_contract[0].amount_type;
                    }
                    return { doc }
                }
            }
            if (isUpdate) {
                if (doc.contract) {
                    let this_contract = await this.getObject('contracts').find({ filters: [['_id', '=', doc.contract]] });
                    if (this_contract[0].project) {
                        doc.project = this_contract[0].project;
                    }
                    if (this_contract[0].amount_type) {
                        doc.amount_type = this_contract[0].amount_type;
                    }
                    return { doc }
                }
            }
        }
    }
}

/**
 * const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'finance_invoice',

    beforeInsert: async function(){
        let doc = this.doc;
        if (doc.contract){           
            let steedosSchema = objectql.getSteedosSchema();
            let this_contract = await steedosSchema.getObject('contracts').find({ filters: [['_id', '=', doc.contract]] });
            if (this_contract[0].project){
                doc.project = this_contract[0].project;
            }
            if (this_contract[0].amount_type){
                doc.amount_type = this_contract[0].amount_type;
            }
        }   
    },

    beforeUpdate: async function(){
        let doc = this.doc;
        if (doc.contract){           
            let steedosSchema = objectql.getSteedosSchema();
            let this_contract = await steedosSchema.getObject('contracts').find({ filters: [['_id', '=', doc.contract]] });
            if (this_contract[0].project){
                doc.project = this_contract[0].project;
            }
            if (this_contract[0].amount_type){
                doc.amount_type = this_contract[0].amount_type;
            }
        }   
    
    },

}
 */