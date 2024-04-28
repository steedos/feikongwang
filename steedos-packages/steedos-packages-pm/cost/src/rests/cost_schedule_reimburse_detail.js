/*
 * @Author: 苏佳豪 sujiahao@steedos.com
 * @Date: 2023-09-20 09:29:12
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-19 15:24:38
 * @Description: 将选中的费用记录添加到日常报销明细/差旅报销明细
 */
const _ = require('lodash')

module.exports = {
	addReimburesDetail: {
		rest: {
			method: "POST",
			fullPath: "/api/add/reimbures",
		},
		async handler(ctx) {
			const { records, targetObj, masterRecordId, preTargetOb } = ctx.params
			const userSession = ctx.meta.user
			const { userId, spaceId, companyId } = userSession
			// 只有apiNames中的对象才进行数据转换
			const apiNames = ["cost_schedule_reimburse_detail", "cost_business_reimburse_detail", "cost_loan_detail"];
			if (!_.includes(apiNames, targetObj)) {
				return { 'status': 500, 'msg': '请在正确的对象记录操作', 'data': {} }
			}

			try {
				// 处理对象字段映射
				const dataMap = {
					"cost_schedule_reimburse_detail": 'daily_expense',
					"cost_business_reimburse_detail": 'daily_expense',
					"cost_loan_detail": 'daily_expense',
				};
				for (const record of records) {
					let insertDoc = {
						'amount': record.amount,
						'date': record.date,
						'expend_type': record.expend_type,
						'remark': record.remark,
						'space': ctx.meta.user.spaceId,
						'created_by': userId,
						'modified_by': userId,
						'company_id': companyId,
						'cost_code':record._id,
					};
					insertDoc[dataMap[targetObj]] = masterRecordId;
					await ctx.broker.call(
						'objectql.insert',
						{ 'objectName': targetObj, 'doc': insertDoc },
						{'meta': {'user': userSession}}	
					)
					// 报销明细记录添加完成后，更新费用记录状态，标记为审核中
					await ctx.broker.call(
						'objectql.update',
						{ 'objectName': 'cost_reimburse_detail', 'doc': { 'status': 'approving' }, 'id': record._id }
						


					);
					//回带费用单据
					const instanceDoc = await this.broker.call(
						'objectql.update',
						{
							objectName: 'cost_reimburse_detail',
							doc: {
								instance: {
									"o": preTargetOb,
									"ids": [
										masterRecordId
									]
								}
							},
							id: record._id
						},
					);
				}

				return { 'status': 0, 'msg': '添加成功', 'data': {} };
			} catch (error) {
				console.error(error);
				return { 'status': 500, 'msg': JSON.stringify(error), 'data': {} };
			}
		}
	}
};
