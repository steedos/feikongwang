/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-24 16:15:01
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-24 16:25:25
 * @FilePath: /steedos-ee-gitlab/steedos-packages-oa/okr/src/triggers/okr_kr_progress__c_trigger.js
 * @Description: 
 */
module.exports = {
    trigger: {
        listenTo: 'okr_kr_progress2', // TODO 未找到此对象定义
        when: [
            'beforeInsert',
            'beforeUpdate',
            'afterInsert',
            'afterUpdate',
            'afterDelete'
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;
        if (isBefore) {
            if (isInsert) {
                let keyResult = await this.getObject('okr_key_results').findOne(doc.key_result);
                if (doc.target_type = 'Increase to') {
                    doc.progress = (doc.current_progress - keyResult.starting_value) / (keyResult.target - keyResult.starting_value);
                } else {
                    doc.progress = (keyResult.starting_value - doc.current_progress) / (keyResult.starting_value - keyResult.target);
                }
            }
            if (isUpdate) {
                let keyResult = await this.getObject('okr_key_results').findOne(doc.key_result);
                if (doc.target_type = 'Increase to') {
                    doc.progress = (doc.current_progress - keyResult.starting_value) / (keyResult.target - keyResult.starting_value);
                } else {
                    doc.progress = (keyResult.starting_value - doc.current_progress) / (keyResult.starting_value - keyResult.target);
                }
            }
        }
        if (isAfter) {
            if (isInsert) {
                await this.caculateProcess(doc.key_result);

                let objective_id = await this.getObject('okr_key_results').findOne(doc.key_result, { fields: ['objective'] });
                let objective_id2 = objective_id.objective
                await this.caculateObjective(objective_id2);
            }
            if (isUpdate) {
                await this.caculateProcess(doc.key_result);

                let objective_id = await this.getObject('okr_key_results').findOne(doc.key_result, { fields: ['objective'] });
                let objective_id2 = objective_id.objective
                await this.caculateObjective(objective_id2);
            }
            if (isDelete) {
                await this.caculateProcess(this.previousDoc.key_result);

                let objective_id = await this.getObject('okr_key_results').findOne(this.previousDoc.key_result, { fields: ['objective'] });
                let objective_id2 = objective_id.objective
                await this.caculateObjective(objective_id2);
            }
        }
    }
}

/**
 * const keyResult = require('./okr_keyresults.manager');
const objective = require('./okr_objective.manager');

module.exports = {
  listenTo: 'okr_kr_progress2',
  beforeInsert: async function () {
    let doc = this.doc;
    let keyResult = await this.getObject('okr_key_results').findOne(doc.key_result);
    if (doc.target_type = 'Increase to') {
      doc.progress = (doc.current_progress-keyResult.starting_value) /(keyResult.target-keyResult.starting_value) ;
    } else{
      doc.progress = (keyResult.starting_value-doc.current_progress) /(keyResult.starting_value-keyResult.target) ;
    }  
  },

  beforeUpdate: async function () {
    let doc = this.doc;
    let keyResult = await this.getObject('okr_key_results').findOne(doc.key_result);
    if (doc.target_type = 'Increase to') {
      doc.progress = (doc.current_progress-keyResult.starting_value) /(keyResult.target-keyResult.starting_value) ;
    } else{
      doc.progress = (keyResult.starting_value-doc.current_progress) /(keyResult.starting_value-keyResult.target) ;
    }  
  },

   afterInsert: async function () {
    await keyResult.caculateProcess(this.doc.key_result);

    let objective_id = await this.getObject('okr_key_results').findOne(this.doc.key_result, { fields: ['objective'] });
    let objective_id2 =  objective_id.objective
    await objective.caculateObjective(objective_id2);
  },

  afterUpdate: async function () {
    await keyResult.caculateProcess(this.doc.key_result);

    let objective_id = await this.getObject('okr_key_results').findOne(this.doc.key_result, { fields: ['objective'] });
    let objective_id2 =  objective_id.objective
    await objective.caculateObjective(objective_id2);
  },

  afterDelete: async function () {
    await keyResult.caculateProcess(this.previousDoc.key_result);

    let objective_id = await this.getObject('okr_key_results').findOne(this.previousDoc.key_result, { fields: ['objective'] });
    let objective_id2 =  objective_id.objective
    await objective.caculateObjective(objective_id2);
  }, 
}
 */