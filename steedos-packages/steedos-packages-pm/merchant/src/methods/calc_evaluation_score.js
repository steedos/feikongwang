/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-10-09 17:39:42
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-10-12 13:32:36
 * @FilePath: /steedos-ee/steedos-packages-pm/merchant/src/methods/calc_evaluation.score.js
 * @Description: 获取聚合查询条件
 */

module.exports = {
    /**
     * 获取聚合查询条件
     */
    getScorePipeline () {
        return [
            {
              '$match': {'used': {'$eq': false}}
            },
            {
              '$group': {
                '_id': {
                  'supplier': "$supplier",
                },
                'score': {'$sum': {'$multiply': ["$score", "$template_item_weight", "$template_weight", "$assessor_weight"]}},
                'name': {'$first': '$name'}
              }
            }, {
              '$addFields': {
                'supplier': "$_id.supplier"
              }
            }, {
              '$project': {
                'supplier': 1,
                'score': 1, 
                '_id': 0,
                'name': 1
              }
            }
        ];
    }
}