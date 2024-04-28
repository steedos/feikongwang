// 项目任务标记完成
module.exports = {
    rest: {
        method: 'GET',
        path: '/projects_ee/project_task',
        authorization: false,
        //authentication: false,
    },
    params: {
        projectTaskId: {
            type: 'string',
            optional: true
        }
    },
    handler: async function (ctx) {
        const {projectTaskId} = ctx.params;
        const projectTaskObj = this.getObject("project_task");
        const projectTaskDoc = {
            has_complete:true,
            completed_date:new Date()
        }
        //新增潜在客户
         await projectTaskObj.update(projectTaskId,projectTaskDoc);
    }
}