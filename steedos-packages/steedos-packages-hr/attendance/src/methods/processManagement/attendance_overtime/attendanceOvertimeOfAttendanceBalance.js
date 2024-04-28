/*
 * @Date: 2023-08-16 15:55:23
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-16 15:55:30
 */
const _ = require('lodash')
'use strict';
module.exports = {
	/**
	 * 加班审批通过后，如果假期余额没有调休假，添加一条，否则更新
	 */
	handler: async function (workOvertimeTrip) {
		console.log("加班台账", workOvertimeTrip)
		const staff = workOvertimeTrip.staff;
		const hours = workOvertimeTrip.hours;
		var year = new Date(workOvertimeTrip.start).getFullYear();
		// 查询考勤规则
		const rule = await this.queryAttendanceRules(staff);
		var working_hour = rule.daily_hours;

		// 查询假期类型判断是否有调休假
		const ifHaveTransferLeave = await this.ifHaveTransferLeave()
		if (ifHaveTransferLeave) {
			// 查询用户假期余额中是否关联调休假
			const attendanceBalanceInformation = await this.findAttendanceBalance(staff, ifHaveTransferLeave._id, year);
			if (attendanceBalanceInformation) {
				// 修改关于调休假的假期余额
				await this.updateAttendanceBalanceOfTransferLeave(attendanceBalanceInformation, workOvertimeTrip, working_hour)
			} else {
				// 创建关于调休假的假期余额
				await this.createAttendanceBalanceOfTransferLeave(workOvertimeTrip, ifHaveTransferLeave._id, year, working_hour)
			}
		}
	}
}
