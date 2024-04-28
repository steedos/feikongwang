/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 18:01:56
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 18:02:12
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/cost/src/triggers/cost_personal_loan_trigger.js
 * @Description: 
 */
module.exports = {
    trigger: {
        listenTo: 'cost_personal_loan', // 借款
        when: [
            'beforeInsert',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;
        if (isBefore) {
            if (isInsert) {
                doc.state = "还款中";
                return {
                    doc
                }
            }
        }
    }
}

/**
 * const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'cost_personal_loan',

    beforeInsert: async function(){
        let doc = this.doc;
        doc.state = "还款中";

    },

    beforeUpdate: async function(){
    },

    afterInsert: async function(){
    },

    afterUpdate: async function(){
    },

    afterDelete: async function(){
    },

}
 */