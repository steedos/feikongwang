
const express = require('express');
const fetch = require('node-fetch');
const url = require('url');
const dd = require('dingtalk-jsapi');
var router = express.Router();
module.exports = {
    rest: {
        method: "GET",
        fullPath: "/api/dingtalk/feikongwang/auth_login",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
       let {code,authCode} = ctx.params;
       console.log("授权回调",ctx.params)
        // 获取免登授权码
       dd.runtime.permission.requestAuthCode({
        corpId: code,
        onSuccess: function(result) {
            console.log("=====获取免登授权码",result)
        },
        onFail : function(err) {}
     
    })
    let suiteKey = process.env.STEEDOS_DD_SAAS_SUITEKEY;
    let suiteSecret  = process.env.STEEDOS_DD_SAAS_SUITESECRET
    // 获取access_token
    let accessToken = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetAccessToken', {
        "suiteKey": suiteKey,
        "suiteSecret": suiteSecret,
        "authCorpId": "",
        "suiteTicket":""
    });
    // 获取用户userid
    // let userInfo = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetUserId', {
    //     "access_token":accessToken.accessToken,
    //     "code":code
    // });

    let userInfo = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetSsoUserInfo', {
        "access_token":accessToken.accessToken,
        "code":code
    });
    }
}