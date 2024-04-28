/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-09-22 10:20:45
 * @LastEditors: 苏佳豪 sujiahao@steedos.com
 * @LastEditTime: 2023-09-22 11:18:09
 * @Description: 招投标管理中的通用函数  
 */
module.exports = {
    
    // 通过立项状态编码获取立项状态id
    getBiddingStatusByCode: {
        params: {
            code: {type: 'string'}
        },

        async handler(ctx) {
            const { code } = ctx.params
            try {
                const record = await ctx.broker.call('objectql.find',
                {
                    'objectName': 'bidding_status',
                    'query': { filters: ['code', '=', code], fields: ['_id'] }
                });
                return record[0]._id
            } catch(error) {
                console.error('error: ', error);
                return null;
            }
        }
    }
}