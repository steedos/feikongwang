// const Cookies = require("cookies");
// const express = require('express');
// const fetch = require('node-fetch');
// const Qiyeweixin = require("../qywx");
// module.exports = {
//     rest: {
//         method: "GET",
//         fullPath: "/api/qiyeweixin/feikongwang/auth_login",
//         authorization: false,
//         authentication: false
//     },
//     handler: async function (ctx) {
//         const { code } = ctx.params;
//         console.log("========>code", code);
//         console.log("======ctx.params", ctx.params);
//         let suite_id = process.env.STEEDOS_QYWX_SAAS_SUITEID;
//         let suite_secret = process.env.STEEDOS_QYWX_SAAS_SUITE_SECRET;

//         // getconfigurations
//         const configurations = await ctx.broker.call('@steedos/plugin-qywx.getConfigurations', {
//             "_id": suite_id
//         });

//         console.log("configurations", configurations)
//         let suite_ticket = configurations.suite_ticket;
//         const auth_code = configurations.auth_code;
//         // 获取第三方应用凭证
//         const suiteAccessToken = await ctx.broker.call('@steedos/plugin-qywx.getSuiteAccessToken', {
//             "suite_id": suite_id,
//             "suite_secret": suite_secret,
//             "suite_ticket": suite_ticket
//         });
//         console.log("第三方应用凭证", suiteAccessToken)
//         // 获取访问用户身份
//         const userData = await ctx.broker.call('@steedos/plugin-qywx.getUserInfo3rd', {
//             "code": code,
//             "suite_access_token": suiteAccessToken.suite_access_token
//         });
//         console.log("===userData", userData);
//         // 获取访问用户敏感信息
//         const userDetailData = await ctx.broker.call('@steedos/plugin-qywx.getUserDetailInfo3rd', {
//             "suite_access_token": suiteAccessToken.suite_access_token,
//             "user_ticket": userData.user_ticket
//         });
//         console.log("访问用户敏感信息", userDetailData);


//         // // 获取永久授权码
//         // const permanentCodeDoc = await ctx.broker.call('@steedos/plugin-qywx.getPermanentCode', {
//         //     "auth_code": auth_code,
//         //     "suite_access_token": suiteAccessToken.suite_access_token
//         // });
//         // console.log("永久授权码", permanentCodeDoc);



//         // TODO
//         /**
//          * 1、根据corpid 在space查询记录，如找不到则执行新建space逻辑.如找到则根据企业微信userid查询user,如找不到，则执行创建user逻辑，若找到了则执行创建space_user逻辑。
//          * 2、新建space逻辑:1、获取管理员user记录，若获取不到，则执行新建管理员user逻辑。 2、创建spaces
//          * 3、管理员与普通用户区分逻辑:不区分
//          * 4、创建space_users
//          * 5、判断是否在同一个工作区：根据space表中的qywx_corp_id区分，若相同则表示在
//          */
//         // 创建space_user
//         const userInfo = await ctx.broker.call('@steedos/plugin-qywx.createSpaces_users', {
//             "user": userDetailData,
//             "permanentCodeDoc": permanentCodeDoc,
//         });
//         console.log("userInfo======",userInfo)

//         // 设置Cookies,并且保存
//         let data = {
//             userId: userInfo.userId,
//             spaceId: userInfo.spaceId,
//             redirect_url: 'https://5000-moccasin-rat-0uhcjp22.ws.vscode.steedos.cn'
//         }
//         console.log("====data", data)
//         console.log("重定向到费控王主页");
//         let response = await fetch('https://5000-moccasin-rat-0uhcjp22.ws.vscode.steedos.cn/api/qiyeweixin/tofkw/auth_login', {
//             method: 'post',
//             body: JSON.stringify(data),
//             headers: {
//                 'Content-Type': 'application/json'
//             }
//         }).then(res => res.text());




//     }
// }