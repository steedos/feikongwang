const qywx_api = require('../router');
const Qiyeweixin = require("../qywx");
const express = require('express');
const fetch = require('node-fetch');
module.exports = {
    rest: {
        method: "GET",
        fullPath: "/api/qiyeweixin/keikongwang/mainpage",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
        ctx.meta.$location = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=&redirect_uri=https://5000-moccasin-rat-0uhcjp22.ws.vscode.steedos.cn&response_type=code&scope=snsapi_privateinfo&state=STATE#wechat_redirect`
        ctx.meta.$statusCode = 302;

        // 调用构造第三方应用oauth2链接
        let o = await fetch("https://open.weixin.qq.com/connect/oauth2/authorize?appid=&redirect_uri=https://5000-moccasin-rat-0uhcjp22.ws.vscode.steedos.cn&response_type=code&scope=snsapi_privateinfo&state=STATE#wechat_redirect");
        console.log("成员票据",o)

        // 获取第三方应用凭证
        const suite_id = "";
        const suite_secret = "";
        const suite_ticket = "";

       var data = {
            suite_id: suite_id,
            suite_secret: suite_secret,
            suite_ticket: suite_ticket
        };
        let suite_access_token_info = await fetch(`https://qyapi.weixin.qq.com/cgi-bin/service/get_suite_token`, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        console.log("第三方应用凭证",suite_access_token_info)

        // 获取访问用户敏感信息
        if(suite_access_token_info.suite_access_token){
            let userData = {
                user_ticket: "USER_TICKET"
            }  
            console.log("url",`https://qyapi.weixin.qq.com/cgi-bin/service/auth/getuserdetail3rd?suite_access_token=${suite_access_token_info.suite_access_token}`)
            let userInfo = await fetch(`https://qyapi.weixin.qq.com/cgi-bin/service/auth/getuserdetail3rd?suite_access_token=${suite_access_token_info.suite_access_token}`, {
                method: 'post',
                body: JSON.stringify(userData),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());
            console.log("===用户信息",userInfo)
        }
        
        
        // const suiteAccessToken = await Qiyeweixin.getSuiteAccessToken(suite_id, suite_secret, suite_ticket);


        // console.log("====>suiteAccessToken",suiteAccessToken)

        // if (suiteAccessToken.errcode == 0) {
        //     // 获取访问用户敏感信息
        //     const suite_access_token = suiteAccessToken.suite_access_token
        //     const user_ticket = "USER_TICKET"
        //     const userInfo = await Qiyeweixin.getUserDetail(suite_access_token, user_ticket);
        //     console.log("====>userInfo",userInfo)
        // }
        return



    }
}