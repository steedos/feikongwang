/*
 * @Author: 易仕川 yishichuan@steedos.com
 * @Date: 2023-08-14 15:12:47
 * @LastEditors: 易仕川 yishichuan@steedos.com
 * @LastEditTime: 2023-08-14 17:53:06
 * @FilePath: /chinaums-oa-apps/steedos-packages/hr/src/actions/hr_onboarding/hr_onboarding.js
 * @Description: 人事：入职流程审批通过后，自动创造数据在花名册中
 * 
 * Copyright (c) 2023 by 易仕川 , All Rights Reserved. 
 */
'use strict';
module.exports = {

    handler: async function (ctx) {
        const doc = ctx.params.doc;
        const userSession = await ctx.broker.call('@steedos/service-accounts.getUserSession', {userId: doc.owner, spaceId: doc.space});
        console.log("审批状态",doc.instance_state)
        await this.createHrEmployee(doc,userSession);

    }
}