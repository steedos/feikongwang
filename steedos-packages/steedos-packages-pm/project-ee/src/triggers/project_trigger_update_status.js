/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-25 14:16:15
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-25 14:19:53
 * @FilePath: /steedos-ee-gitlab/steedos-packages-pm/project-ee/src/triggers/project_trigger_update_status.js
 * @Description: 
 */
module.exports = {
    trigger: {
        listenTo: 'project',
        when: [
            'afterUpdate',
        ],
    },
    async handler(ctx) {
        const { isInsert, isUpdate, isDelete, isFind, isBefore, isAfter, id, doc, previousDoc, size, userId, spaceId, objectName, query, data } = ctx.params;

        if (isAfter) {

            if (isUpdate) {
                const objectObj = this.getObject("project");
                const doc = await objectObj.findOne(id);

                //发起流程后，项目状态变更为立项中
                if (doc.instance_state == 'pending' && doc.instance_state != previousDoc.instance_state) {
                    await objectObj.directUpdate(id, { status: 'approving' });
                }
                //审批通过后，状态变更为进行中
                if (doc.instance_state == 'approved' && doc.instance_state != previousDoc.instance_state) {
                    await objectObj.directUpdate(id, { status: 'working' });
                }
                //审批不通过/取消申请，状态变更为已中止
                if ((doc.instance_state == 'rejected' || doc.instance_state == 'terminated') && doc.instance_state != previousDoc.instance_state) {
                    await objectObj.directUpdate(id, { status: 'aborted' });
                }
            }

        }
    }
}

/**
 * const objectql = require('@steedos/objectql');

module.exports = {
    listenTo: 'project',

    afterUpdate: async function(){
        const id = this.doc._id;
        const previousDoc = this.previousDoc;
        const doc = await this.getObject('project').findOne(id);
        const objectObj = objectql.getObject("project");

        //发起流程后，项目状态变更为立项中
        if (doc.instance_state == 'pending' && doc.instance_state != previousDoc.instance_state) {
            await objectObj.directUpdate(id, { status: 'approving' });
        }
        //审批通过后，状态变更为进行中
        if (doc.instance_state == 'approved' && doc.instance_state != previousDoc.instance_state) {
            await objectObj.directUpdate(id, { status: 'working' });
        }
        //审批不通过/取消申请，状态变更为已中止
        if ((doc.instance_state == 'rejected'||doc.instance_state == 'terminated') && doc.instance_state != previousDoc.instance_state) {
            await objectObj.directUpdate(id, { status: 'aborted' });
        }
    },

}
 */