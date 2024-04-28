/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-11-16 10:53:18
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-11-16 11:40:13
 * @Description: 
 */
"use strict";
// @ts-check

module.exports = {
    listenTo: 'seal_create',

    afterEnd: async function (event, context) {
        try {
            const objectql = require('@steedos/objectql');
            const { id, userId, spaceId, flowName, instance, broker} = event.data;
            const { state, traces, final_decision } = instance;
            if (final_decision == 'approved') {
                let seals = instance.values.seal_detail;
                for (let seal of seals) {
                    let company = new Array();
                    let instance_approval = new Array();

                    company.push(seal.company._id)
                    instance_approval.push({'_id': instance._id})
                    let insertDoc = {
                        'name': seal.name,
                        'seal_admin': seal.seal_admin.user,
                        'company_ids': company,
                        'company_id': seal.company._id,
                        'state': 'enable',
                        'space': instance.space,
                        'owner': instance.applicant,
                        'instances': instance_approval,
                        'created': instance.created,
                        'created_by': instance.applicant
                    };
                    await objectql.getObject('seal').insert(insertDoc);
                }
            }
        } catch (error) {
            console.error(error)
        }
    },
}

