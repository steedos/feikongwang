
const express = require('express');
const fetch = require('node-fetch');
const url = require('url');
const dd = require('dingtalk-jsapi');
var router = express.Router();
module.exports = {
    rest: {
        method: "GET",
        fullPath: "/api/dingtalk/feikongwang/mainpage",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
        console.log("钉钉单点登录",ctx.params);
        let {corpid} = ctx.params;
        let url = ""
        redirect_uri = encodeURIComponent(await this.broker.call('objectql.absoluteUrl', { path: 'api/dingtalk/feikongwang/auth_login' }));
        let suiteKey = process.env.STEEDOS_DD_SAAS_SUITEKEY
        url = "https://login.dingtalk.com/oauth2/auth?redirect_uri="+redirect_uri+"&response_type=code"+"&client_id="+suiteKey+"&scope="+corpid+"&prompt=consent"
        console.log("url",url)
        ctx.meta.$statusCode = 302;
        ctx.meta.$location = url;
        return
    }
}