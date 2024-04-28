/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-10-27 14:39:33
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-28 11:06:22
 * @FilePath: /steedos-ee-gitlab/steedos-packages-hr/performance/src/index.js
 * @Description: 
 */
"use strict";

const path = require('path');
const project = require('../package.json');
const packageName = project.name;

const packageLoader = require('@steedos/service-package-loader');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: [packageLoader],
	/**
	 * Settings
	 */
	settings: {
		rest: "/"
	},
    metadata: {
        $package: {
            name: project.name,
            path: path.join(__dirname, ".."),
            isPackage: true
        }
    },

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		// 复制考核模版
		duplicateTemplate: {
			rest: {method: 'POST', path: '/performance/template/duplicate'},
			async handler(ctx) {
				const userSession = ctx.meta.user;
				const templateRecord = await ctx.broker.call(
					'objectql.findOne', 
					{
						'objectName': 'performance_template',
						'id': ctx.params._id,
						'query': {}
					}
				)
				const indexRecords = await ctx.broker.call(
					'objectql.find',
					{
						'objectName': 'performance_index',
						'query': {
							'filters': [['performance_template', '=', ctx.params._id]]
						}
					}
				)	
				const newId = await ctx.broker.call(
					'objectql._makeNewID',
					{
						'objectName': 'performance_template'
					}
				)				
				let templateInsertDoc = {
					'_id': newId,
					'name': templateRecord.name + '-复制',
					'latitude': templateRecord.latitude,
					'status': 'disable',
					'start_date': templateRecord.start_date,
					'end_date': templateRecord.end_date,
					'version': templateRecord.version,
					'summary_weight': templateRecord.summary_weight,
					'space': userSession.spaceId
				}
				await ctx.broker.call(
					'objectql.insert',
					{
						'objectName': 'performance_template',
						'doc': templateInsertDoc
					}
				)
				
				// 复制考核指标
				if (indexRecords.length) {
					for (let indexRecord of indexRecords) {
						let newIndexId = await ctx.broker.call(
							'objectql._makeNewID',
							{
								'objectName': 'performance_index'
							}
						)
						let insertDoc = Object.assign({}, {
							'_id': newIndexId,
							'performance_template': newId,
							'sequence_number': indexRecord.sequence_number,
							'name': indexRecord.name,
							'description': indexRecord.description,
							'weight': indexRecord.weight,
							'space': userSession.spaceId
						})
						await ctx.broker.call(
							'objectql.insert',
							{
								'objectName': 'performance_index',
								'doc': insertDoc
							},
							{
								meta:{user: userSession}
							}
						)
						// await indexObj.insert(insertDoc, userSession);
					}
				}
				return ;
			}
		},

		// 复制考核计划
		duplicatePlan: {
			rest: {method: 'POST', path: '/performance/plan/duplicate'},
			async handler(ctx) {
				const userSession = ctx.meta.user;
				const planRecord = await ctx.broker.call(
					'objectql.findOne',
					{
						'objectName': 'performance_plan',
						'id': ctx.params._id,
						'query': {}
					}
				)
				let planItemRecords = await ctx.broker.call(
					'objectql.find',
					{
						'objectName': 'performance_plan_item',
						'query': {
							filters: [['performance_plan', '=', ctx.params._id]]
						}
					}
				)
				// 复制考核计划
				const newPlanId = await ctx.broker.call(
					'objectql._makeNewID',
					{
						'objectName': 'performance_plan'
					}
				)
				let insertDoc = {
					'_id': newPlanId,
					'name': planRecord.name + '-复制',
					'notes': planRecord.notes,
					'start_date': planRecord.start_date,
					'end_date': planRecord.end_date,
					'status': 'unplayed',
					'space': userSession.spaceId
				}
				await ctx.broker.call(
					'objectql.insert',
					{
						'objectName': 'performance_plan',
						'doc': insertDoc,
					},
					{
						meta: {user: userSession}
					}
				)
				// 复制考核计划明细
				for (let planItem of planItemRecords) {
					let newPlanItemId = await ctx.broker.call(
						'objectql._makeNewID',
						{
							'objectName': 'performance_plan_item'
						}
					)
					let planItemDoc = {
						'_id': newPlanItemId,
						'name': planItem.name,
						'performance_plan': newPlanId,
						'performance_template': planItem.performance_template,
						'start_date': planItem.start_date,
						'end_date': planItem.end_date,
						'assessor': planItem.assessor,
						'employee': planItem.employee,
						'template_weight': planItem.template_weight,
						'assessor_weight': planItem.assessor_weight,
						'space': userSession.spaceId
					}
					// 使用insert自动生成考核数据。
					await ctx.broker.call(
						'objectql.insert',
						{
							'objectName': 'performance_plan_item',
							'doc': planItemDoc
						},
						{
							meta: {user: userSession}
						}
					)
				}

			}
		},

		// 生成考核数据
		createPerformanceData: {
			rest: {method: 'POST', path: '/performance/create/data'},
			async handler(ctx) {
				// _id: 考核计划明细id
				const {_id, planId, templateId, assessor, employee} = ctx.params;
				const userSession = ctx.meta.user;
				await this.addPerformanceDataRecord(ctx, _id, planId, templateId, assessor, employee, userSession);
			}
		},

		// 更新考核数据
		updatePerformanceData: {
			rest: {method: 'POST', path: '/performance/update/data'},
			async handler(ctx) {
				const {_id, planId, templateId, assessor, employee} = ctx.params;
				const userSession = ctx.meta.user;
				
				// 删除旧数据
				let dataRecords = await ctx.broker.call(
					'objectql.find',
					{
						'objectName': 'performance_data',
						'query': {
							filters: [['performance_plan_item', '=', _id]]
						}
					}
				)
				for (let record of dataRecords) {
					await ctx.broker.call(
						'objectql.delete',
						{
							'objectName': 'performance_data',
							'id': record._id
						}
					)
				}
				// 生成新的考核数据
				await this.addPerformanceDataRecord(ctx, _id, planId, templateId, assessor, employee, userSession);
			}
		},

		// 根据考核数据计算出考核结果
		calcPerformanceData: {
			async handler(ctx) {
				const { planId } = ctx.params; // 考核计划id
				const userSession = ctx.meta.user;
				try {
					let pipeline = await this.getPipeline(planId);
					/**
					 * records是汇总出的考核结果集。
					 * 其中month_score是月度考核得分，quarter_score是季度得分，也就是这个月的分数在季度总分数的占比分数，
					 * 即quarter_score = month_socre * template_weight
					 * quarter_score作为隐藏字段用于之后考核汇总时使用，考核结果阶段不显示。
					 */
					let records = await ctx.broker.call(
						'objectql.aggregate',
						{
							'objectName': 'performance_data',
							'query': {},
							'externalPipeline': pipeline
						}
					)
					for (let record of records) {
						let insertDoc = {
							'performance_plan': record.performance_plan,
							'employee': record.employee,
							'year': record.year,
							'quarter': record.quarter,
							'score': record.month_score,
							'quarter_score': record.quarter_score,
							'organization': record.organization,
							'type': record.type
						}
						await ctx.broker.call(
							'objectql.insert',
							{
								'objectName': 'performance_result',
								'doc': insertDoc
							},
							{
								meta: {user: userSession}
							}
						)
					}
				} catch (error) {
					console.error(error)
				}
			}
		},

		// 汇总考核结果，生成最终结果
		summaryPerformanceResult: {
			async handler(ctx) {
				const {year, quarter} = ctx.params;
				const userSession = ctx.meta.user;
		
				try {
					let pipeline = await this.getSummaryPipeline(year, quarter);
					let records = await ctx.broker.call(
						'objectql.aggregate',
						{
							'objectName': 'performance_result',
							'query': {},
							'externalPipeline': pipeline
						},
						{
							meta: {user: userSession}
						}
					)
					for (let record of records) {
						let insertDoc = {
							'year': record.year,
							'quarter': record.quarter,
							'employee': record.employee,
							'organization': record.organization,
							'score': record.res,
							'space': userSession.spaceId
						}
						await ctx.broker.call(
							'objectql.insert',
							{
								'objectName': 'performance_summary',
								'doc': insertDoc
							}
						)
					}
				} catch (error) {
					console.error(error)
				}
			}
		},

		// 计算考核系数
		calcPerformanceCoefficient: {
			async handler(ctx) {
				const {year, quarter} = ctx.params;
				const userSession = ctx.meta.user;

				// 获取分管领导人员列表和部门经理人员列表
				let dep_Mangers = await this.getFlowRoleUsers('部门经理', userSession)
				let leaders = await this.getFlowRoleUsers('集团分管领导', userSession)
				let excludeUser = [];
				if (dep_Mangers.length > 0 && leaders.length > 0) {
					excludeUser = [...dep_Mangers[0].distinctMember, ...leaders[0].distinctMember];
				}

				// 部门绩效平均分
				let depAvergerScore = await this.getDepAvagerScore(year, quarter, excludeUser, userSession);
				console.log('depAvergerScore: ', depAvergerScore);
				// 计算考核系数
				let summaryDocs = await ctx.broker.call(
					'objectql.find',
					{
						'objectName': 'performance_summary',
						'query': {
							filters: [['year', '=', year],['quarter', '=', quarter]]
						}
					}
				)
				
				let updateArray = this.calculateCoefficient(summaryDocs, excludeUser, depAvergerScore);
				console.log('updateArray: ', updateArray)
				for (let updateDoc of updateArray) {
					await ctx.broker.call(
						'objectql.update',
						{
							'objectName': 'performance_summary',
							'id': updateDoc._id,
							'doc': {'coefficient': updateDoc.coefficient}
						}
					)
				}
				
			}
		}
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		/**
		 * 生成考核数据
		 * @param {*} _id 考核计划明细id
		 * @param {*} planId 考核计划id
		 * @param {*} templateId 考核模版id
		 * @param {*} assessor 考核人
		 * @param {*} employee 被考核人
		 * @param {*} userSession 用户权限
		 */
		addPerformanceDataRecord: {
			async handler(ctx, _id, planId, templateId, assessor, employee, userSession) {
				// 查找考核指标
				const records = await ctx.broker.call(
					'objectql.find',
					{
						'objectName': 'performance_index',
						'query': {
							filters: [['performance_template', '=', templateId]]
						}
					}
				)
				const plan = await ctx.broker.call(
					'objectql.findOne',
					{
						'objectName': 'performance_plan',
						'id': planId,
						'query': {}
					}
				)

				// 生成考核数据
				for (let record of records) {
					let insertDoc = {
						'performance_plan': planId,
						'performance_plan_item': _id,
						'assessor': assessor,
						'employee': employee,
						'performance_index': record._id,
						'year': plan.year,
						'quarter': plan.quarter,
						'type': plan.type,
						'max_score': plan.max_score,
						'submitted': false
					}
					await ctx.broker.call(
						'objectql.insert',
						{
							'objectName': 'performance_data',
							'doc': insertDoc
						},
						{
							meta: {user: userSession}
						}
					)
				}
			}
		},

		/**
		 * 获取计算考核数据聚合条件
		 * @param {*} planId 
		 */
		getPipeline: {
			async handler(planId) {
				return [
					{
					  $match: {
						'performance_plan': planId,
					  }
					},{ 
					  $group: {
						'_id': "$employee",
						'month_score': {$sum: {$multiply: ["$score", "$weight"]}},
						'quarter_score': {$sum: {$multiply: ["$score", "$weight", "$template_weight"]}},
						'performance_plan': {$first: "$performance_plan"},
						'year': {$first: "$year"},
						'quarter': {$first: "$quarter"},
						'type': {$first: "$type"}
					  }
					},{
					  $lookup: {
						'from': "space_users",
						'localField': "_id",
						'foreignField': "user",
						'as': "employee",
					  }
					},{
					  $unwind: {
						'path': "$employee",
						'preserveNullAndEmptyArrays': false,
					  }
					},{
					  $addFields: {
						'name': "$employee.name",
						'employee': "$_id",
						'organization': "$employee.organization",
						'performance_plan': "$performance_plan",
					  }
					},{
					  $project: {
						'month_score': 1,
						'employee': 1,
						'name': 1,
						'organization': 1,
						'performance_plan': 1,
						'quarter_score': 1,
						'year': 1,
						'quarter': 1,
						'type': 1
					  }
					},
				  ]
			}
		},

		/**
		 * 获取汇总结果的聚合条件
		 * @param {*} year 年份
		 * @param {*} quarter 季度
		 */
		getSummaryPipeline: {
			async handler(year, quarter) {
				return [
					{
					  '$match':  {$and: [{"year": year}, {"quarter": quarter}]}
					}, {
					  '$group': {
						'_id': '$employee',
						'year': {$first: '$year'},
						'quarter': {$first: '$quarter'},
						'organization': {$first: '$organization'},
						'accessment': {
						  $push: {
							$cond: {
								if: {$eq: ["$type", "accessment"]},
							  then: '$quarter_score',
							  else: '$$REMOVE',
							}
						  }
						},
						'personal': {
						  $push: {
							$cond: {
								if: {$eq: ["$type", "personal"]},
								then: '$quarter_score',
								else: '$$REMOVE',
							}
						  }
						},
						
					  }
					}, {
					  '$addFields': {
						'employee': '$_id',
						'access_score': {$avg: "$accessment"},
						'personal_score': {$avg: "$personal"}
					  }
					}, {
					  '$project': {
						'employee': 1,
						'year': 1,
						'quarter': 1,
						'access_score': 1,
						'personal_score': 1,
						'organization': 1,
						'res': {$add: ['$access_score', '$personal_score']}
					  }
					}
				  ]
			}
		},

		/**
		 * 获取对应岗位的人员列表
		 * @param {*} depName 岗位名称
		 * @param {*} userSession 用户认证
		 * @return member: 所有该岗位的人员； distinctMember: member去重后的结果,其中只记录member的id
		 */
		getFlowRoleUsers: {
			async handler(depName, userSession) {
				// 聚合条件
				const pipeline = [
					{
					  $lookup: {
						'from': 'flow_roles',
						'localField': 'role',
						'foreignField': '_id',
						'as': 'dep'
					  }
					}, {
					  $lookup: {
						'from': 'space_users',
						'localField': 'users',
						'foreignField': 'user',
						'as': 'space_user'
					  }
					}, {
						$unwind: {
						  'path': '$dep',
						  'preserveNullAndEmptyArrays': false
						}
					}, {
					  $unwind: {
						'path': '$space_user',
						'preserveNullAndEmptyArrays': false
					  }
					},
				  {
					$match: {
					  'dep.name': {$eq: depName}
					}
				  }, {
					$group: {
					  '_id': '$dep._id',
					  'depName': {$first: '$dep.name'},
					  'member': {
						$push: {'name': '$space_user.name', '_id': '$space_user.user'}
					  },
					  'distinctMember': {
						$addToSet: '$space_user.user'
					  }
					}
				  }
				];

				try {
					return await this.broker.call(
						'objectql.aggregate',
						{
							'objectName': 'flow_positions',
							'query': {},
							'externalPipeline': pipeline
						},
						{
							meta: {user: userSession}
						}
					)
				} catch (error) {
					console.error(error)
				}
				
			}
		},

		/**
		 * 统计各个部门的绩效平均分
		 * @param {*} year 年份
		 * @param {*} quarter 季度
		 * @param {Array} excludeUser 统计平均分时需要排除的用户
		 * @param {*} userSession 用户认证
		 */
		getDepAvagerScore: {
			async handler(year, quarter, excludeUser) {
				const pipeline = [
					{
					  $match: {
						$and: [
						  {'year': year},
						  {'quarter': quarter},
						  {'employee': {$nin: excludeUser}}
						]
					  }
					}, {
					  $group: {
						'_id': '$organization',
						'sum': {$sum: '$score'},
						'avg': {$avg: '$score'},
					  }
					}
				];
				try {
					// 获取部门平均分
					let records = await this.broker.call(
						'objectql.aggregate',
						{
							'objectName': 'performance_summary',
							'query': {},
							'externalPipeline': pipeline
						}
					)
					// 重构数据格式：格式为 [{'部门id'：部门分数}, {'部门id'：部门分数}, ...]
					let res = {};
					for (let record of records) {
						Object.assign(res, {[record._id]: record});
					}
					return res;
				} catch (error) {
					console.error(error)
				}
			}
		},

		/**
		 * 计算绩效系数
		 * @param {*} summaryDocs  
		 * @param {*} managers 
		 * @param {*} depAvergerScore 
		 */
		calculateCoefficient(summaryDocs, managers, depAvergerScore) {
			console.log('manager: ', managers);
			let updateArray = new Array();
			for (let doc of summaryDocs) {
				let updateDoc = {};
				let employee = doc.employee;
				let score = doc.score; // 个人分数
				let coefficient = 1.00; // 绩效系数；
				console.log('employee: ', employee)
				if (managers.indexOf(employee) !== -1) { 
					// 中高层人员 
					if (score > 100) {
						coefficient = score / 100; // 60-100按系数1，超过100分直接除100
					}
				} else {
					// 普通员工
					let dep = doc.organization; // 部门
					let avgScore = depAvergerScore[dep].avg; // 部门平均分
					let diff = parseInt((score - avgScore) / 10) * 0.1;  // 部门平均分的上下10分范围内都为系数1，按每10分为10%的系数递增或递减
					coefficient = 1.00 + diff;
					
				}
				updateArray.push(Object.assign(updateDoc, {'_id': doc._id, 'coefficient': coefficient}));
			}
			return updateArray;
		}

	},

	/**
	 * Service created lifecycle event handler
	 */
	async created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
