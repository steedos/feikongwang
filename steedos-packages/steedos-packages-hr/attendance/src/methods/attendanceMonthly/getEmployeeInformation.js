/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-10 10:22:03
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-11 09:20:57
 * @FilePath: /chinaums-oa-apps/steedos-packages/attendance/src/methods/attendanceMonthly/getEmployeeInformation.js
 * @Description: 查询员工信息
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (userId) {
        const user = await this.broker.call(
            'objectql.find',
            {
                objectName: 'space_users',
                query: {
                    filters: ["user","=",userId],
                },
            },
        );
       return user[0];
    }
}