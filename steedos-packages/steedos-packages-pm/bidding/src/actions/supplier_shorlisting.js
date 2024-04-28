/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-09-22 11:58:06
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-09-25 17:02:58
 * @Description: 供应商入围后相关业务操作
 */
const moment = require('moment');

module.exports = {
    // 入围审批通过后，生成供应商入围信息，
    addShortlisting: {
        params: {
            project_program: {type: 'string'},
            bidding: {type: 'string'},
            accounts: {type: 'array'}
        }, 
        async handler(ctx) {
            const {project_program, bidding, accounts} = ctx.params;
            const user = ctx.meta.user;
            const date = moment().format('YYYY-MM-DD'); // 取审核通过的时间作为入围时间，即调用此接口的时间

            for (let item of accounts) {
                let insertDoc = {
                    'project_program': project_program,
                    'bidding': bidding,
                    'account': item.account,
                    'shortlisting_date': date,
                    'space': user.spaceId
                }
                await ctx.broker.call('objectql.insert', 
                    {'objectName': 'account_shortlisting', 'doc': insertDoc})
                ;
            }
        }
    }
}