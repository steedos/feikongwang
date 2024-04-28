/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-14 15:41:05
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-14 18:12:49
 * @FilePath: /chinaums-oa-apps/steedos-packages/hr/src/methods/hr_onboarding/createHrEmployee.js
 * @Description: 根据审批通过的调动申请单信息修改到花名册中离职时间、员工状态
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
module.exports = {
    handler: async function (doc) {
        //根据员工id修改花名册信息
        await this.broker.call(
            'objectql.update',
            {
                objectName: 'hr_employee',
                doc: {
                  "resign_date":doc.end, //离职时间
                  "status":"out"
                },
                id: doc.staff
            },
        );
      
    }
}