/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-12 13:45:40
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-16 16:05:14
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/actions/processManagement_working/index.js
 * @Description:
 *
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved.
 */
module.exports = {
	workOvertimeSettlement: require('./attendance_overtime/workOvertimeSettlement'),
	attendanceBalanceManagement: require('./attendance_leave/attendanceBalanceManagement'),
	attendance_leave_change_attendance_days: require('./attendance_leave/attendance_leave_change_attendance_days'),
	processManagement_leave_validate_fields: require('./attendance_leave/processManagement_leave_validate_fields'),
	retroactiveValidate: require('./attendance_retroactive/retroactiveValidate'),
	retroactiveSettlement: require('./attendance_retroactive/retroactiveSettlement'),
	IsTheHolidayBalanceEnough: require('./attendance_leave/IsTheHolidayBalanceEnough'),
	businessTripSettlement: require('./attendance_business_out/businessTripSettlement'),
	leaveSettlement: require('./attendance_leave/leaveSettlement'),
	outSettlement: require('./attendance_going_out/outSettlement'),
	attendanceleaveOfattendanceBalance: require('./attendance_leave/attendanceleaveOfattendanceBalance'),
	attendanceOvertimeOfattendanceBalance: require('./attendance_overtime/attendanceOvertimeOfattendanceBalance'),
	countTimes:require('./countTimes/countTimes'),
	countOverTimes:require('./attendance_overtime/countOverTimes'),
	afterInsertCountBusinessTimes:require('./attendance_business_out/afterInsertCountBusinessTimes'),
	afterInsertCountGoingOutTimes:require('./attendance_going_out/afterInsertCountGoingOutTimes'),
}
