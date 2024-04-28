/*
 * @Date: 2023-08-16 18:25:29
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-16 18:49:06
 */
const _ = require('lodash');
const moment = require('moment');
module.exports = {

	handler: async function (ctx) {
		const doc = ctx.params.doc;

		// 获取补卡台账对应的每日考勤记录
		const attendanceDaily = await ctx.call('objectql.findOne', {
			objectName: 'attendance_daily',
			id: doc.attendance_daily,
		})
		const queryAttendanceRules = await this.queryAttendanceRules(doc.staff);  //查询该员工下的考勤规则
		if (queryAttendanceRules) {
			var work_start = await this.formatAttendanceRulesTime(queryAttendanceRules.work_start);//上班班时间
			var work_end = await this.formatAttendanceRulesTime(queryAttendanceRules.work_end);//下班时间
			console.log("上班时间", work_start);
			console.log("下班时间", work_end);
			
			if (doc.start != undefined) {
				var start = moment(doc.start).utcOffset(8).format("YYYY-MM-DD"); //上班卡的时间  年-月-日
				var startTime = moment(doc.start).utcOffset(8).format("HH:mm:00");//上班卡的时间  时：分：秒
				console.log("上班卡的时间  时：分：秒", startTime)
				if (work_start != startTime) {
					if (work_start < startTime) {
						throw new Error('补卡的上班时间需小于等于上班时间');
					}
				}
			} else if (doc.end != undefined) {
				var end = moment(doc.end).utcOffset(8).format("YYYY-MM-DD"); //下班卡的时间  年-月-日
				var endTime = moment(doc.end).utcOffset(8).format("HH:mm:00");//下班卡的时间  时：分：秒
				console.log("下班卡的时间  时：分：秒", endTime)
				if (work_end != endTime) {
					if (work_end >= endTime) {
						throw new Error('补卡的下班时间需大于等于下班时间');
					}
				}
			}
			var date = moment(attendanceDaily.date).format("YYYY-MM-DD");
			console.log("异常考勤情况的考勤日期", date);
			console.log("补卡上班时间", start);
			console.log("补卡下班时间", end);
			if (date == start || date == end) {
				console.log("补卡台账创建成功")
			} else {
				throw new Error('必须根据你要补的异常记录中日期来选择补卡日期');
			}
			if (!attendanceDaily.start && attendanceDaily.end && doc.type == "quit" && attendanceDaily.status.includes('lack')) {
				throw new Error('该异常记录是未打上班卡，需补上班卡')
			}
			if (attendanceDaily.start && !attendanceDaily.end && doc.type == "work" && attendanceDaily.status.includes('lack')) {
				throw new Error('该异常记录是未打下班卡，需补下班卡')
			}
			if (attendanceDaily.status.includes('late') && !attendanceDaily.status.includes('lack') && doc.type == "quit" && !attendanceDaily.status.includes('early')) {
				throw new Error('该异常记录是迟到，需补上班卡')
			}
			if (attendanceDaily.status.includes('early') && !attendanceDaily.status.includes('lack') && doc.type == "work" && !attendanceDaily.status.includes('late')) {
				throw new Error('该异常记录是早退，需补下班卡')
			}

		} else {
			throw new Error('该员工没有考勤组')
		}



	}
}
