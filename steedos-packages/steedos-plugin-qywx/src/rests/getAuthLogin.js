const Cookies = require("cookies");
const express = require('express');
const fetch = require('node-fetch');
const Qiyeweixin = require("../qywx");
module.exports = {
    rest: {
        method: "GET",
        fullPath: "/api/qiyeweixin/feikongwang/auth_login",
        authorization: false,
        authentication: false
    },
    handler: async function (ctx) {
        const { code } = ctx.params;
        console.log("========>code", code);
        console.log("======ctx.params",ctx.params);
        let suite_id = process.env.STEEDOS_QYWX_SAAS_SUITEID;
        let suite_secret = process.env.STEEDOS_QYWX_SAAS_SUITE_SECRET;
        // console.log("=======>suite_id",suite_id);
        // console.log("=========>suite_secret",suite_secret);
        let suite_ticket = "";
        // 获取第三方应用凭证
        const suiteAccessToken = await ctx.broker.call('@steedos/plugin-qywx.getSuiteAccessToken', {
            "suite_id": suite_id,
            "suite_secret": suite_secret,
            "suite_ticket": suite_ticket
        });
        console.log("第三方应用凭证", suiteAccessToken)
        // 获取访问用户身份
        const userData = await ctx.broker.call('@steedos/plugin-qywx.getUserInfo3rd', {
            "code": code,
            "suite_access_token": suiteAccessToken.suite_access_token
        });
        console.log("===userData", userData);
        // 获取访问用户敏感信息
        const userDetailData = await ctx.broker.call('@steedos/plugin-qywx.getUserDetailInfo3rd', {
            "suite_access_token": suiteAccessToken.suite_access_token,
            "user_ticket": userData.user_ticket
        });
        console.log("访问用户敏感信息",userDetailData);

        // 费控王创建部门信息

        //
        let doc = {
            name:`${userDetailData.name}`,
            password_expired:false,
            sms_notification:false,
            user_accepted:true,
            zoom:"normal",
            locked:false,
            profile:"user"
        }
        const userDoc = await ctx.broker.call('@steedos/plugin-qywx.createUser', {
            "doc": doc,
        });
        console.log("userDoc",userDoc)
        
    }
}