/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-10-09 15:10:38
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-10-18 13:41:40
 * @FilePath: /steedos-ee/steedos-packages-pm/merchant/src/methods/account_evalutaion.js
 * @Description: 供应商评审选择模版后生成对应的填分数据
 */

module.exports = {
    /**
     * 根据表格数据生成需要评分数据
     * @param {*} table 表格内容
     * @returns 
     */
    async addEvaluationItem (row, assess_evaluation, assess_evaluation_score, userSession) {
        
        let { name, supplier, assessor, template, assessor_weight, template_weight } = row;
        let spaceId = userSession.spaceId;
        
        // 找到此模版的对应的指标
        let items = await this.broker.call(
            'objectql.find',
            {
                'objectName': 'assess_template_item', 
                'query': {'fields': ['_id', 'weight', 'content'], 'filters': ['assess_template', '=', template]}
            }   
        )
        for (const item of items) {
            let insertDoc = {
                'name': name,
                'supplier': supplier,
                'assessor': assessor,
                'assessor_weight': assessor_weight,
                'template': template,
                'template_weight': template_weight,
                'template_item': item._id,
                'template_item_weight': item.weight,
                'content': item.content,
                'space': spaceId,
                'assess_evaluation': assess_evaluation,
                'assess_evaluation_score': assess_evaluation_score,
                'used': false
            }
            await this.broker.call(
                'objectql.insert',
                {'objectName': 'assess_template_score', 'doc': insertDoc}
            );
        }
        
        return null;
    }
}