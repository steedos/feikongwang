/*
 * @Date: 2023-08-10 14:50:32
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-10 16:07:50
 */
const moment =require('moment')
const _ = require('lodash')
module.exports = {

	/**
	 *
	 * @param {} userId 用户id
	 * @param {*} workStart 开始外出时间
	 * @param {*} workEnd 结束外出时间
	 * @returns
	 */
	handler: async function (userId,workStart,workEnd,object) {
		const broker = this.broker;
        const objResult = await broker.call('objectql.find', {
            objectName: object,
            query: {
                filters: [
                    ['applicant', '=', userId],
                    ['start_time', '>=', workStart],
                    ['end_time', '<=', workEnd],
                    ['instance_state', '=', 'approved']
                ]
            }
        })
		return objResult;
    }
}
