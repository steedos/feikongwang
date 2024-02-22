
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
        let { code, authCode } = ctx.params;
        console.log("授权回调", ctx.params);
        let suiteKey = process.env.STEEDOS_DD_SAAS_SUITEKEY;
        let suiteSecret = process.env.STEEDOS_DD_SAAS_SUITESECRET
        // 获取获取用户token
        let userToken = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetUserAccessToken', {
            "clientId": suiteKey,
            "clientSecret": suiteSecret,
            "code": authCode,
            // "refreshToken":"",
             "grantType":"authorization_code"
        });
        // 获取用户通讯录个人信息
        let user = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetContactUser', {
            "accessToken": userToken.accessToken,
            "unionId": "me"
        });
        console.log("user",user);
        // 获取第三方应用授权企业的accessToken
        let accessTokenInfo = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetAccessToken', {
            "suiteKey" : suiteKey,
            "suiteSecret" : suiteSecret,
            "authCorpId" : "",
            "suiteTicket" : ""
        });
        console.log("获取第三方应用授权企业的accessToken",accessTokenInfo)
        // 根据unionid获取用户userid
        console.log("===1",user.unionId)
        let userIdDoc = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetUserIdByUnionid', {
            "accessToken": accessTokenInfo.accessToken,
            "unionId": user.unionId
        });
        console.log("根据unionid获取用户userid",userIdDoc);
        // 查询用户详情
        let userInfoDoc = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetUserInfo', {
            "access_token": accessTokenInfo.accessToken,
            "userid": userIdDoc.result.userid
        });
        console.log("用户详情",userInfoDoc)
    }
}