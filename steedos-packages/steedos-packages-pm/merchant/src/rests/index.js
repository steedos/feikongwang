/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-10-08 18:13:43
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-10-12 11:46:19
 * @FilePath: /steedos-ee/steedos-packages-pm/merchant/src/rests/index.js
 * @Description: 
 */
module.exports = {
    ...require('./account_evalution.js'),
    ...require('./calc_evaluation_score.js'),
    ...require('./schema.js')
}