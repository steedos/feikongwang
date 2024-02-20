
const express = require('express');
const fetch = require('node-fetch');
const url = require('url');
var router = express.Router();
module.exports = {
    rest: {
        method: "GET",
        fullPath: "/api/dingtalk/feikongwang/mainpage",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
        console.log("钉钉单点登录",ctx.params)
    }
}