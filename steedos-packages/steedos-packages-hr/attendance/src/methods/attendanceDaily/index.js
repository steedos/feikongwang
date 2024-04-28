/*
 * @Date: 2023-08-11 09:17:24
 * @LastEditors: 高红新 gaohongxin@steedos.com
 * @LastEditTime: 2023-08-11 19:25:55
 */
module.exports = {
    queryAttendanceRules: require('./queryAttendanceRules'),
    originalTimeFormat: require('./originalTimeFormat'),
    formatAttendanceRulesTime: require('./formatAttendanceRulesTime'),
    ifFirstCheckIn: require('./ifFirstCheckIn'),
    createDailyAttendance: require('./createDailyAttendance'),
    createLessDailyAttendance: require('./createLessDailyAttendance'),
    updateDailyAttendance: require('./updateDailyAttendance'),
    getMinuteDifference: require('./getMinuteDifference'),
	getObjectTime: require('./getObjectTime'),
	getObjectInformation: require('./getObjectInformation')
}
