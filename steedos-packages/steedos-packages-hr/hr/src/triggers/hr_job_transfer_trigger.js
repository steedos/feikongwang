/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 11:44:25
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 11:46:31
 * @FilePath: /steedos-ee-gitlab/steedos-packages-hr/hr/src/triggers/hr_job_transfer_trigger.js
 * @Description: 
 */
module.exports = {
    trigger: {
        listenTo: 'hr_job_transfer',
        when: [
            'afterUpdate',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;

        if (isAfter) {

            if (isUpdate) {
                let ins_state = typeof doc !== "undefined" && doc !== null ? doc.instance_state : void 0;

                if (ins_state === "approved") {
                    let updataData = {};
                    updataData.company = doc.company;
                    updataData.department = doc.department;
                    updataData.job_line = doc.job_line;
                    updataData.job_title = doc.job_title;
                    updataData.manager = doc.manager;
                    updataData.venue = doc.venue;
                    updataData.date = doc.date;

                    await this.getObject('hr_employee').directUpdate(doc.staff, updataData);
                }
            }

        }
    }
}

/**
 * const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'hr_job_transfer',

    beforeInsert: async function(){
    },

    beforeUpdate: async function(){
    },

    afterInsert: async function(){
    },

    afterUpdate: async function(){
        let doc = this.doc;
        let ins_state = typeof doc !== "undefined" && doc !== null ? doc.instance_state : void 0;
        
        if (ins_state === "approved"){
            let updataData = {};
            updataData.company = doc.company;
            updataData.department = doc.department;
            updataData.job_line = doc.job_line;
            updataData.job_title = doc.job_title;
            updataData.manager = doc.manager;
            updataData.venue = doc.venue;
            updataData.date = doc.date;
            
            await objectql.getObject('hr_employee').directUpdate(doc.staff, updataData);
        }

    },

    afterDelete: async function(){
    },

}
 */