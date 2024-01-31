const qywx_api = require('../router');
const Qiyeweixin = require("../qywx");
const express = require('express');
const fetch = require('node-fetch');
const url = require('url');
var router = express.Router();
module.exports = {
    rest: {
        method: "GET",
        fullPath: "/api/qiyeweixin/feikongwang/mainpage",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
        let authorize_uri, o, redirect_uri, url, _ref5, _ref6, _ref7;
        authorize_uri = qywx_api.authorize_uri;
        // 网页授权登陆
        redirect_uri = encodeURIComponent(await this.broker.call('objectql.absoluteUrl', { path: 'api/qiyeweixin/feikongwang/auth_login' }));
        console.log("=====redirect_uri", redirect_uri);

        let appid = process.env.STEEDOS_QYWX_SAAS_SUITEID;
        let { target = '' } = ctx.params;
        url = authorize_uri + '?appid=' + appid + '&redirect_uri=' + redirect_uri + `&response_type=code&scope=snsapi_privateinfo&state=${target}#wechat_redirect`;
        ctx.meta.$statusCode = 302;
        ctx.meta.$location = url;
        return



    }
}