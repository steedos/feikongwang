/*
 * @Author: 孙浩林 sunhaolin@steedos.com
 * @Date: 2023-08-03 19:55:08
 * @LastEditors: 孙浩林 sunhaolin@steedos.com
 * @LastEditTime: 2023-08-08 10:57:21
 * @FilePath: /chinaums-oa-apps-gitlab/steedos-packages/attendance/src/methods/dailySettlement/index.js
 * @Description: 
 */
module.exports = {
    generateDateTimeByDateAndTime: require('./generateDateTimeByDateAndTime'),
    getAbsentRuleWithoutTotal: require('./getAbsentRuleWithoutTotal'),
    getAttendanceByDate: require('./getAttendanceByDate'),
    getDiffMinutes: require('./getDiffMinutes'),
    getDiffMinutesInSameDay: require('./getDiffMinutesInSameDay'),
    getSettlementScope: require('./getSettlementScope'),
    getUserStartAndEndWorkTime: require('./getUserStartAndEndWorkTime'),
    healthCheck: require('./healthCheck'),
    getSettlementDateList: require('./getSettlementDateList'),
    isBusinessTrip: require('./isBusinessTrip'),
    isLeave: require('./isLeave'),
    isOut: require('./isOut'),
    updateAttendanceDaily: require('./updateAttendanceDaily'),
    //................
    getSpaceUsers: require('./getSpaceUsers'),
    calcBusinessTripInfo: require('./calcBusinessTripInfo'),
    calcLeaveInfo: require('./calcLeaveInfo'),
    calcOutInfo: require('./calcOutInfo'),
    millisecondToMinites: require('./millisecondToMinites'),
    minutesTohours: require('./minutesTohours'),
    createAttendanceDaily: require('./createAttendanceDaily'),
    calcLackInfo: require('./calcLackInfo'),
    calcWorkOvertimeInfo: require('./calcWorkOvertimeInfo'),
    calcLateInfo: require('./calcLateInfo'),
    countWorkStartOfProcess: require('./countWorkStartOfProcess'),
    calcEarlyInfo: require('./calcEarlyInfo'),
    countWorkEndOfProcess: require('./countWorkEndOfProcess'),
    countAttendanceDuration: require('./countAttendanceDuration'),
    calcAbsentInfo: require('./calcAbsentInfo'),
    findRange: require('./findRange'),
    calcRetroactive: require('./calcRetroactive'),
    IfneedSettlement: require('./IfneedSettlement'),

}