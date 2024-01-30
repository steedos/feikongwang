/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-25 13:53:02
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-25 13:55:40
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/finance/src/triggers/finance_payment_trigger_set_default_value.js
 * @Description: 
 */
module.exports = {
    trigger: {
        listenTo: 'finance_payment', // 付款
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
    listenTo: 'finance_payment',

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