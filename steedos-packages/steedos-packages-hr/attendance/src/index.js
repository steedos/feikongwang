/*
 * @Author: sunhaolin@hotoa.com
 * @Date: 2022-03-04 17:02:52
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-10-28 11:05:49
 * @Description: 
 */
"use strict";
const path = require('path');
const project = require('../package.json');
const packageName = project.name;

const packageLoader = require('@steedos/service-package-loader');
const dailySettlementActions = require('./actions/dailySettlement');
const dailySettlementMethods = require('./methods/dailySettlement');
const attendanceDailyActions = require('./actions/attendanceDaily');
const attendanceDailyMethods = require('./methods/attendanceDaily');
const ifClockInTodayAPIActions = require('./actions/ifClockInTodayAPI');
const ifClockInTodayAPIMethods = require('./methods/ifClockInTodayAPI');
const attendanceGroupActions = require('./actions/attendance_group');
const attendanceGroupMethods = require('./methods/attendance_group');
const attendanceMonthlyActions = require('./actions/attendanceMonthly');
const attendanceMonthlyMethods = require('./methods/attendanceMonthly');
const processManagementActions = require('./actions/processManagement');
const processManagementMethods = require('./methods/processManagement');
const attendanceActions = require('./actions/attendance');
const Cron = require("moleculer-cron");
const crons = require('./crons');
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * 软件包服务启动后也需要抛出事件。
 */
module.exports = {
	name: packageName,
	namespace: "steedos",
	mixins: [packageLoader, Cron],
	/**
	 * Settings
	 */
	settings: {

	},
	metadata: {
		$package: {
			name: project.name,
			path: path.join(__dirname, ".."),
			isPackage: true
		}
	},
	crons:crons,

	/**
	 * Dependencies
	 */
	dependencies: ["@steedos-labs/project", "@steedos-labs/cost"],
	
	

	/**
	 * Actions
	 */
	actions: {
		// 每日结算
		...dailySettlementActions,
		//每日考勤情况
		...attendanceDailyActions,
		//判断当日是否能打卡
		...ifClockInTodayAPIActions,
		// 考勤组
		...attendanceGroupActions,
		//月度考勤报表
		...attendanceMonthlyActions,
		//流程管理-加班
		...processManagementActions,
		// 原始打卡记录
		...attendanceActions,
		// 获取icon地址
		getIconAction: {
			rest: {
				method: "GET",
				fullPath: "/attendance/image/:name",
			},
			async handler(ctx) {
				const fs = require('fs');
				const path = require('path');
				const { name } = ctx.params;
				ctx.meta.$responseType = "image/png";
				// 构建完整的文件路径
				const pngPath = path.join(__dirname, "..",'image', name)
				// 读取 PNG 图像文件数据
				let PngBuffer = fs.readFileSync(pngPath);
				return Buffer.from(PngBuffer)
			}
		},
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
		//每日结算
		...dailySettlementMethods,
		//每日考勤情况
		...attendanceDailyMethods,
		//判断当日是否能打卡
		...ifClockInTodayAPIMethods,
		// 考勤组
		...attendanceGroupMethods,
		// 月度考勤报表
		...attendanceMonthlyMethods,
		//流程管理-加班
		...processManagementMethods

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
