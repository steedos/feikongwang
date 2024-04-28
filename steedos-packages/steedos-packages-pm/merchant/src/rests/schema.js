/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-10-11 13:23:36
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-10-18 16:17:41
 * @FilePath: /steedos-ee/steedos-packages-pm/merchant/src/rests/schema.js
 * @Description: 通过schemaApi将“开始评分”按钮的自定义返回
 */
module.exports = {
    tableView: {
        rest: {
            method: 'POST',
            fullPath: '/api/evaluation/schema'
        }, 
        async handler(ctx) {
            const userSession = ctx.meta.user;
            const tableData = await this.getTableViewData(userSession.userId);
            const tableViewSchema = this.getTableViewSchema(tableData);
            return { "status": 0, "msg": "", "data": tableViewSchema }
        }
    },

    updateEvaluation: {
        rest: {
            method: "POST",
            fullPath: '/api/evaluation/score/update'
        },
        async handler(ctx) {
            const {assess_evaluation, assess_evaluation_score} = ctx.params;
            try {
                // 检测是否已将分数填写完成
                const notFinished = await ctx.broker.call(
                    'objectql.find',
                    {
                        'objectName': 'assess_template_score', 
                        'query': {'filters': [['assess_evaluation', '=', assess_evaluation], ['score', '=', null]], 'fields': []}
                    }    
                )

                if (!notFinished || notFinished.length > 0 ) {
                    return {'status': 500, 'msg': '请将数据补充完整', data: {}};
                }

                // 填写完成后，将供应商评估和供应商评分中对应的记录标记为已完成
                await ctx.broker.call(
                    'objectql.directUpdate',
                    {'objectName': 'assess_evaluation', 'id': assess_evaluation, 'doc': {'finished': true}}    
                )
                await ctx.broker.call(
                    'objectql.directUpdate',
                    {'objectName': 'assess_evaluation_score', 'id': assess_evaluation_score, 'doc': {'finished': true}}    
                )
                return {'status': 0, 'msg': '', data: {}}
            } catch (error) {
                console.error(error);
                return {'status': 500, 'msg': error, data: {}};
            }
            
        }
    }
}