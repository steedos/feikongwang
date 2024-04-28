/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-09 14:07:45
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-12 10:06:44
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/index.js
 * @Description: 
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    countTheMonthClockIndays: require('./countTheMonthClockIndays'),
    getMonthlyAttendanceRange: require('./getMonthlyAttendanceRange'),
    countTheMonthworking: require('./countTheMonthworking'),
    getUsers: require('./getUsers'),
    createAttendanceMonthly: require('./createAttendanceMonthly'),
    getEmployeeInformation: require('./getEmployeeInformation'),
    getEmployeeMonthlyLateInformation: require('./getEmployeeMonthlyLateInformation'),
    getEmployeeMonthlyEarlyInformation: require('./getEmployeeMonthlyEarlyInformation'),
    getEmployeeMonthlyleaveInformation: require('./getEmployeeMonthlyleaveInformation'),
    getEmployeeMonthlybusinessInformation: require('./getEmployeeMonthlybusinessInformation'),
    getEmployeeMonthlyOutInformation: require('./getEmployeeMonthlyOutInformation'),
    getEmployeeMonthlyAbsentInformation: require('./getEmployeeMonthlyAbsentInformation'),
    getEmployeeMonthlyWorkingInformation: require('./getEmployeeMonthlyWorkingInformation'),
    getEmployeeMonthlyNormalInformation: require('./getEmployeeMonthlyNormalInformation'),
    getEmployeeAbsenteeismRules: require('./getEmployeeAbsenteeismRules'),
    findAttendanceMonthlyInformation: require('./findAttendanceMonthlyInformation'),
    
}