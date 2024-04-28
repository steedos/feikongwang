"use strict";
// @ts-check

module.exports = {
    listenTo: '*',

    afterStepSubmit: async function (event, context) {
        try {
            const objectql = require('@steedos/objectql');
            const Fiber = require("fibers");
            console.log('processTrigger afterStepSubmit Called!!!!!!!!!!!!!!!!');
            const { id, userId, spaceId, flowName, instance, broker } = event.data;
            const { state, traces } = instance;

            if (state == 'pending') {
                const suObj = objectql.getObject('space_users');
                const userObj = objectql.getObject('users');

                let userIdsBelongToEmployee = []; // 记录已完成的approve的用户对应的所属同一个employe的其他用户id，用于跟未完成的approve用户id比对，如果包含未完成的approve用户id则将未完成的approve一并处理掉
                let unfinishedHandlers = [];

                const lastTrace = traces[traces.length - 1];
                let unfinishedApproves = {};
                let next_steps = [];

                for (const appr of lastTrace.approves) {
                    if (appr.type !== 'cc') { // 查找非传阅的approve
                        const handler = appr.handler;
                        if (appr.is_finished) {
                            const suDoc = (await suObj.find({ filters: [['space', '=', spaceId], ['user', '=', handler]], fields: ['hr_employee_id'] }))[0];
                            const employeeId = suDoc.hr_employee_id;
                            if (employeeId) {
                                const suDocs = await suObj.find({ filters: [['hr_employee_id', '=', employeeId], ['user', '!=', handler]], fields: ['user'] }); // 查找同一个employe下的非当前用户
                                for (const doc of suDocs) {
                                    userIdsBelongToEmployee.push(doc.user);
                                }
                            }
                            next_steps = appr.next_steps;
                        }
                        else {
                            unfinishedHandlers.push(handler);
                            unfinishedApproves[handler] = appr;
                        }
                    }
                }
                for (const uId of unfinishedHandlers) {
                    if (userIdsBelongToEmployee.includes(uId)) {
                        // 自动处理申请单
                        let userDoc = await userObj.findOne(uId);
                        let approve_from_client = {
                            ...unfinishedApproves[uId],
                            "is_read": true,
                            "values": {},
                            "read_date": new Date().toISOString(),
                            "judge": "approved",
                            "next_steps": next_steps
                        }
                        Fiber(function () {
                            try {
                                uuflowManager.workflow_engine(approve_from_client, userDoc, uId);
                            } catch (error) {
                                console.error(error);
                            }
                        }).run();
                    }
                }

            }
        } catch (error) {
            console.error(error)
        }

    },
}