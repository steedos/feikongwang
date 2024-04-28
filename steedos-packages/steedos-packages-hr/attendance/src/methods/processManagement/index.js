/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-12 15:23:53
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-15 17:53:34
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/processManagement_working/index.js
 * @Description:
 *
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved.
 */
module.exports = {
    findAttendanceDailyOfUserIdAndApplyDate: require('./attendance_overtime/findAttendanceDailyOfUserIdAndApplyDate'),
    updateAttendanceDailyInformation: require('./attendance_overtime/updateAttendanceDailyInformation'),
    createAttendanceDailyInformation: require('./attendance_overtime/createAttendanceDailyInformation'),
    findAttendanceLeaveType: require('./attendance_leave/findAttendanceLeaveType'),
    findAttendanceBalance: require('./attendance_balance/findAttendanceBalance'),
    ifHaveTransferLeave: require('./attendance_leave/ifHaveTransferLeave'),
    createAttendanceBalanceOfTransferLeave: require('./attendance_balance/createAttendanceBalanceOfTransferLeave'),
    attendanceOvertimeOfAttendanceBalance: require('./attendance_overtime/attendanceOvertimeOfAttendanceBalance'),
    updateAttendanceBalanceOfTransferLeave: require('./attendance_balance/updateAttendanceBalanceOfTransferLeave'),
    freezeHolidayBalance: require('./attendance_balance/freezeHolidayBalance'),
    updateHolidayBalance: require('./attendance_leave/updateHolidayBalance'),
    rejectHolidayBalance: require('./attendance_leave/rejectHolidayBalance'),
    //countLeaveTimes:require('./attendance_leave/countLeaveTimes'),
    getLeaveDateList:require('./attendance_leave/getLeaveDateList'),
}
