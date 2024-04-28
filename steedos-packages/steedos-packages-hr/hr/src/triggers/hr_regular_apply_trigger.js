/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 11:57:24
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 11:58:54
 * @FilePath: /steedos-ee-gitlab/steedos-packages-hr/hr/src/triggers/hr_regular_apply_trigger.js
 * @Description: 
 */
module.exports = {
    trigger: {
        listenTo: 'hr_regular_apply',
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
                    await this.getObject('hr_employee').directUpdate(doc.staff, { position_status: "正式" });

                    let hr_onboarding = await this.getObject('hr_onboarding').findOne({ filters: [['staff', '=', doc.staff]] });

                    if (hr_onboarding) {
                        await this.getObject('hr_onboarding').directUpdate(hr_onboarding._id, { position_status: "正式" });
                    }
                }
            }

        }
    }
}
/**
 * const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'hr_regular_apply',

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
            await objectql.getObject('hr_employee').directUpdate(doc.staff, { position_status : "正式" });
            
            let hr_onboarding = await objectql.getObject('hr_onboarding').findOne({ filters: [['staff', '=', doc.staff]] });

            if (hr_onboarding){
                await objectql.getObject('hr_onboarding').directUpdate(hr_onboarding._id, { position_status : "正式" });
            }
        }

    },

    afterDelete: async function(){
    },

}
 */