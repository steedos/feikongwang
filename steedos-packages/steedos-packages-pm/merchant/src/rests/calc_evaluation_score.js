/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-10-12 11:11:12
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-10-25 11:07:54
 * @FilePath: /steedos-ee/steedos-packages-pm/merchant/src/rests/evaluation_score.js
 * @Description: 计算供应商评分接口
 */
module.exports = {
    /**
     * 计算履约评分
     */
    calcEvaluationScore: {
        rest: {
            method: 'POST',
            fullPath: '/api/evaluation/calc'
        },
        async handler(ctx) {
            const user = ctx.meta.user;
            const entities = await ctx.broker.call(
                'objectql.aggregate',
                {
                    objectName: 'assess_data',
                    query: {},
                    externalPipeline: this.getScorePipeline()
                },
            )
            // 将结果写入数据库
            for (const entity of entities) {
                let insertDoc = Object.assign({}, entity, {'space': user.spaceId});
                await ctx.broker.call(
                    'objectql.insert',
                    {'objectName': 'assess_score', 'doc': insertDoc}
                )
            }

            return {'status': 0, 'msg': '', 'data': {}}
        }
    }
}