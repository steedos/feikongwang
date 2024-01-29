const _ = require('lodash');
// const objectql = require('@steedos/objectql');
const Qiyeweixin = require("./qywx");
const qywx_api = require('./router.js');
const fetch =  require('node-fetch');
const qywxSync = require('./sync');

module.exports = {
    name: "qywx",
    mixins: [],
    /**
     * Settings
     */
    settings: {

    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        getSpace: {
            async handler(ctx) {
                const { corpId } = ctx.params;
                return await Qiyeweixin.getSpace(corpId); 
            }
        },
        getToken: {
            async handler(ctx) {
                const { corpId, secret } = ctx.params;
                return await Qiyeweixin.getToken(corpId, secret); 
            }
        },
        getUserInfo: {
            async handler(ctx) {
                const { accessToken, code } = ctx.params;
                return await Qiyeweixin.getUserInfo(accessToken, code); 
            }
        },
        getSpaceUser: {
            async handler(ctx) {
                const { spaceId, userInfo } = ctx.params;
                return await Qiyeweixin.getSpaceUser(spaceId, userInfo); 
            }
        },
        getProviderToken: {
            async handler(ctx) {
                const { corpId, providerSecret } = ctx.params;
                return await Qiyeweixin.getProviderToken(corpId, providerSecret); 
            }
        },
        getLoginInfo: {
            async handler(ctx) {
                const { accessToken, authCode } = ctx.params;
                return await Qiyeweixin.getLoginInfo(accessToken, authCode);
            }
        },
        write: {
            async handler(ctx) {
                const { content } = ctx.params;
                return qywxSync.write(content);
            }
        },
        decrypt: {
            async handler(ctx) {
                return await qywxSync.decrypt(ctx.params);
            }
        },
        userinfoPush: {
            async handler(ctx) {
                const { userId, status = 0 } = ctx.params;
                return await qywxSync.userinfoPush(userId, status);
            }
        },
        deptinfoPush: {
            async handler(ctx) {
                const { deptId, name, parentId, status = 0 } = ctx.params;
                return await qywxSync.deptinfoPush(deptId, name, parentId, status);
            }
        },
        useridPush: {
            async handler(ctx) {
                const { accessToken, userId, mobile } = ctx.params;
                return await qywxSync.useridPush(accessToken, userId, mobile);
            }
        },
        getSpaceUsers: {
            async handler(ctx) {
                const { spaceId } = ctx.params;
                return await Qiyeweixin.getSpaceUsers(spaceId); 
            }
        },
        getUserDetail: {
            async handler(ctx) {
                const { accessToken, userTicket } = ctx.params;
                return await Qiyeweixin.getUserDetail(accessToken, userTicket); 
            }
        },
        updateUserMobile: {
            async handler(ctx) {
                const { userId, mobile } = ctx.params;
                return await Qiyeweixin.updateUserMobile(userId, mobile);
            }
        },

        updateUserEmail: {
            async handler(ctx) {
                const { userId, email } = ctx.params;
                return await Qiyeweixin.updateUserEmail(userId, email);
            }
        },

        //工作台首页
        mainpage: {
            rest: {
                method: "GET",
                fullPath: "/api/qiyeweixin/mainpage",
                authorization: false,
                authentication: false
            },
            async handler(ctx) {
                let authorize_uri, o, redirect_uri, url, _ref5, _ref6, _ref7;
                
                let appid = "";
                o = await Qiyeweixin.getSpace();

                let signature = Qiyeweixin.getSignature();

                // 推送消息重定向url
                let { target = '' } = ctx.params;

                if (o) {
                    redirect_uri = encodeURIComponent(objectql.absoluteUrl('api/qiyeweixin/auth_login'));
                    authorize_uri = qywx_api.authorize_uri;

                    if (!authorize_uri)
                        return;
                    if (o.qywx_corp_id)
                        appid = o.qywx_corp_id;
                    if (o.qywx_agent_id)
                        agentid = o.qywx_agent_id;

                    url = authorize_uri + '?appid=' + appid + '&redirect_uri=' + redirect_uri + `&response_type=code&scope=snsapi_privateinfo&state=${target}&agentid=${agentid}#wechat_redirect`;
                    ctx.meta.$statusCode = 302;
                    ctx.meta.$location = url;
                    return ;
                }
                
                
            }
        },
        //推送消息
        push: {
            rest: {
                method: "POST",
                fullPath: "/api/qiyeweixin/push",
                authorization: false,
                authentication: false
            },
            async handler(ctx) {
                const { qywx_userId, agentId, spaceId, text, url, title } = ctx.params;
                let space = await this.broker.call('objectql.findOne', {objectName: 'spaces', id: spaceId})
                let service = space.services.qiyeweixin;
                let o = await this.broker.call('serviceConfiguration.findOne', {query: {
                    service: "qiyeweixin"
                }})
                at = Qiyeweixin.getCorpToken(service.corp_id, service.permanent_code, o.suite_access_token);
                if (at && at.access_token) {
                    service.access_token = at.access_token;
                }
                let msg = {
                    "touser": qywx_userId,
                    "msgtype": "textcard",
                    "agentid": agentId,
                    "textcard": {
                        "title": title,
                        "description": text,
                        "url": url,
                        "btntxt": "详情"
                    },
                    "safe": 0,
                    "enable_id_trans": 0,
                    "enable_duplicate_check": 0,
                    "duplicate_check_interval": 1
                }
            
                Qiyeweixin.sendMessage(msg, service.access_token);
                return "success";
            } 
        },
        //同步数据
        stockData: {
            rest: {
                method: "GET",
                fullPath: "/api/qiyeweixin/stockData",
                authorization: false,
                authentication: false
            },
            async handler(ctx) {
                let space = await Qiyeweixin.getSpace();
                let access_token = '';
                // 获取access_token
                if (space.qywx_corp_id && space.qywx_secret){
                    let response = await Qiyeweixin.getToken(space.qywx_corp_id, space.qywx_secret);
                    access_token = response.access_token
                }
                
                qywxSync.write("================存量数据开始===================")
                qywxSync.write("access_token:" + access_token)

                let deptListRes = await fetch("https://qyapi.weixin.qq.com/cgi-bin/department/list?access_token=" + access_token);
                // console.log("before deptListRes",deptListRes);
                deptListRes = await deptListRes.json()
                // console.log("deptListRes: ",deptListRes)
                deptListRes = deptListRes.department
                // console.log(deptListRes)
                for (let i = 0; i < deptListRes.length; i++) {
                    qywxSync.write("部门ID:" + deptListRes[i]['id'])
                    await qywxSync.deptinfoPush(deptListRes[i]['id'], deptListRes[i]['name'], deptListRes[i]['parentid'])

                    let userListRes = await fetch("https://qyapi.weixin.qq.com/cgi-bin/user/simplelist?access_token=" + access_token + "&department_id=" + deptListRes[i].id)
                    userListRes = await userListRes.json()
                    userListRes = userListRes.userlist
                    for (let ui = 0; ui < userListRes.length; ui++) {
                        await qywxSync.userinfoPush(userListRes[ui]['userid'])
                    }
                }
                return { message: "ok" };
            } 
        },
        //订阅事件
        listen:{
            rest: {
                method: "GET",
                fullPath: "/api/qiyeweixin/listen",
                authorization: false,
                authentication: false
            },
            async handler(ctx) {
                var query = ctx.params
                // console.log(query)
                var dtSpace = await Qiyeweixin.getSpace();
                // console.log("dtSpace: ",dtSpace);
                // var APP_KEY = dtSpace.qywx_key;
                var APP_SECRET = dtSpace.qywx_secret;
                var AES_KEY = dtSpace.qywx_aes_key;
                var TOKEN = dtSpace.qywx_token;
                var CORPID = dtSpace.qywx_corp_id;

                var signature = query['msg_signature'];
                var timeStamp = query['timestamp'];
                var nonce = query['nonce'];
                var encrypt = query['echostr'];

                var token = TOKEN;    //必须和在注册是一样
                var aesKey = AES_KEY;
                var suiteKey = CORPID;

                data = await qywxSync.decrypt({
                    signature: signature,
                    nonce: nonce,
                    timeStamp: timeStamp,
                    suiteKey: suiteKey,
                    token: token,
                    aesKey: aesKey,
                    encrypt: encrypt
                });
                qywxSync.write(data)
                ctx.meta.$statusCode = 200;
                ctx.meta.$responseType = "text/plain";
                return data.data + ""
            }
        },
        //第三方服务商回调验证
        callback: {
            rest: {
                method: "GET",
                fullPath: "/api/qiyeweixin/callback",
                authorization: false,
                authentication: false
            },
            async handler(ctx) {
                var query = ctx.params;
                var newCrypt = await Qiyeweixin.newCrypt();
                var result = newCrypt.decrypt(query["echostr"]);
                ctx.meta.$statusCode = 200;
                ctx.meta.$responseType = "text/plain";
                return result.message;
            }
        },
        getSpaceByDingtalk: {
            async handler(ctx){
                const { corpId } = ctx.params;
                return await this.getSpaceByDingtalk(corpId);
            }
        },
        getSpaceById: {
            async handler(ctx){
                const { spaceId } = ctx.params;
                return await this.getSpaceById(spaceId);
            }
        },
        getSpaceTop1: {
            async handler(ctx){
                return await this.getSpaceTop1();
            }
        }
    },

    /**
     * Events
     */
    events: {
        'push.send':{
            async handler(ctx){
                const options = ctx.params;
                let oauthUrl = objectql.absoluteUrl('/api/qiyeweixin/mainpage?target=');
                try {
                    // console.log("options:---",options);
                    if (options.from !== 'workflow')
                        return;
    
                    if (!options.payload)
                        return;
    
                    let space = await this.broker.call('objectql.find', {objectName: 'spaces', query: {filters: [["_id", "=",options.payload.space]]}})
    
                    if (!space[0])
                        return;
    
                    if (!space[0].qywx_corp_id || !space[0].qywx_agent_id || !space[0].qywx_secret)
                        return;
    
                    let response = await Qiyeweixin.getToken(space[0].qywx_corp_id, space[0].qywx_secret);
                    let access_token = response.access_token;
    
                    let userId = options.query.userId;
                    let space_user = await this.broker.call('objectql.find', {objectName: 'space_users', query: {filters: [["space", "=", space[0]._id], ["user", "=", userId]]}})
                    
                    if (!space_user[0].qywx_id)
                        return;
    
                    // console.log("Push.send: ",space_user[0]);
                    let qywx_userId = space_user[0].qywx_id;
                    let agentId = space[0].qywx_agent_id;
                    let spaceId = space[0]._id;
                    let payload = options.payload;
                    let url = "";
                    let text = "";
                    let title = "华炎魔方";
    
                    // 审批流程
                    if (payload.instance) {
                        let pushInfo = await Qiyeweixin.workflowPush(options, spaceId, oauthUrl);
                        title = pushInfo.text;
                        text = pushInfo.title;
                        url = pushInfo.url;
                    } else {
                        title = options.title;
                        url = oauthUrl + payload.url;
                    }
    
                    if (payload.related_to) {
                        text = options.text;
                    }
                    // 替换&#x2F为'/'
                    let rg = new RegExp("&#x2F;","g")
                    
                    let msg = {
                        "touser": qywx_userId,
                        "msgtype": "textcard",
                        "agentid": agentId,
                        "textcard": {
                            "title": title.replace(rg,'/'),
                            "description": text.replace(rg,'/'),
                            "url": url,
                            "btntxt": "详情"
                        },
                        "safe": 0,
                        "enable_id_trans": 0,
                        "enable_duplicate_check": 0,
                        "duplicate_check_interval": 1
                    }
                    // 发送推送消息
                    // console.log("msg: ",msg);
                    await Qiyeweixin.sendMessage(msg, access_token);
                } catch (error) {
                    console.error("Push error reason: ", error);
                }
            }
        }
    },

    /**
     * Methods
     */
    methods: {
        getSpaceByDingtalk: async function (corpId) {
            const spaces = await this.broker.call('objectql.find', {objectName: 'spaces', query: {filters: [["dingtalk_corp_id", "=", corpId]]}});
            return spaces.length > 0 ? spaces[0] : null;
        },
        getSpaceById: async function (spaceId) {
            const spaces = await this.broker.call('objectql.find', {objectName: 'spaces', query: {filters: [["_id", "=", spaceId]]}});
            return spaces.length > 0 ? spaces[0] : null;
        },
        getSpaceUserByDingtalk: async function (userId) {
            const records = await this.broker.call('objectql.find', {objectName: 'space_users', query: {filters: [["dingtalk_id", "=", userId]]}});
            return records.length > 0 ? records[0] : null;
        },
        getSpaceTop1: async function () {
            const records = await this.broker.call('objectql.find', {objectName: 'spaces', query: {top: 1}});
            return records.length > 0 ? records[0] : null;
        },

    },

    /**
     * Service created lifecycle event handler
     */
    async created() {

    },

    /**
     * Service started lifecycle event handler
     */
    async started() {

    },

    /**
     * Service stopped lifecycle event handler
     */
    async stopped() {

    }
};