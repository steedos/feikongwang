/*
 * @Author: baozhoutao@steedos.com
 * @Date: 2023-05-22 11:00:55
 * @LastEditors: baozhoutao@steedos.com
 * @LastEditTime: 2023-05-26 09:57:44
 * @Description: 
 */
// const objectql = require('@steedos/objectql');
const dtApi = require("./dt_api");
const dtSync = require("./dt_sync");
// 网页授权url
// const oauthUrl = objectql.absoluteUrl("/sso/dingtalk?corpid=");
const oauthUrl = broker.call('objectql.absoluteUrl', { path: '/sso/dingtalk?corpid=' })


module.exports = {
    name: "dingtalk",
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
        decrypt: {
            async handler(ctx) {
                const { data } = ctx.params;
                return await dtSync.decrypt(data);
            }
        },
        spaceGet: {
            async handler(ctx) {
                const { corpId } = ctx.params;
                return await dtApi.spaceGet(corpId);
            }
        },
        accessTokenGet: {
            async handler(ctx) {
                const { key, secret } = ctx.params;
                return await dtApi.accessTokenGet(key, secret);
            }
        },
        userInfoGet: {
            async handler(ctx) {
                const { accessToken, code } = ctx.params;
                return await dtApi.userInfoGet(accessToken, code);
            }
        },
        departmentListGet: {
            async handler(ctx) {
                const { accessToken } = ctx.params;
                return await dtApi.departmentListGet(accessToken);
            }
        },
        deptinfoPush: {
            async handler(ctx) {
                const { deptId, status = 0 } = ctx.params;
                return await dtSync.deptinfoPush(deptId, status);
            }
        },
        userListGet: {
            async handler(ctx) {
                const { accessToken, departmentId } = ctx.params;
                return await dtApi.userListGet(accessToken, departmentId);
            }
        },
        userinfoPush: {
            async handler(ctx) {
                const { userId, status = 0 } = ctx.params;
                return await dtSync.userinfoPush(userId, status);
            }
        },
        useridPush: {
            async handler(ctx) {
                const { accessToken, mobile } = ctx.params;
                return await dtSync.useridPush(accessToken, mobile);
            }
        },
        sso: {
            async handler(ctx) {
                const { corpId, url, code } = ctx.params;
                console.log("dingtalk_sso----");
                console.log("code: ", code);
                let _config;

                let s = await this.getSpaceByDingtalk(corpId);

                if (!s)
                    throw new Meteor.Error('params error!', 'record not exists!');

                let access_token = dtApi.accessTokenGet(s.dingtalk_key, s.dingtalk_secret).access_token;

                let user_info = dtApi.userInfoGet(access_token, code);

                if (user_info) {
                    console.log("user:", user_info.userid);
                    let user = await this.getSpaceUserByDingtalk(user_info.userid)
                    if (user) {

                    }
                }

                if (access_token && s.dingtalk_agent_id) {
                    // Dingtalk.debug && console.log(s.name);
                    console.log("access_token: ", access_token);
                    let jsapi_ticket = dtApi.jsapiTicketGet(access_token);
                    let ticket = jsapi_ticket.ticket;
                    let nonceStr = 'steedos';
                    let timeStamp = new Date().getTime();

                    let signature = sign(ticket, nonceStr, timeStamp, url);

                    console.log("signature: ", signature);

                    _config = {
                        signature: signature,
                        nonceStr: nonceStr,
                        timeStamp: timeStamp,
                        url: url,
                        corpId: corpId,
                        agentId: s.dingtalk_agent_id,
                        access_token: access_token
                    };

                    return _config;
                }

            }
        },
        getSpaceByDingtalk: {
            async handler(ctx) {
                const { corpId } = ctx.params;
                return await this.getSpaceByDingtalk(corpId);
            }
        },
        getSpaceById: {
            async handler(ctx) {
                const { spaceId } = ctx.params;
                return await this.getSpaceById(spaceId);
            }
        },
        getSpaceTop1: {
            async handler(ctx) {
                return await this.getSpaceTop1();
            }
        }
    },

    events: {
        // 'push.send': {
        //     async handler(ctx) {
        //         let options = ctx.params;
        //         let STEEDOS_TENANT_ENABLE_SAAS = process.env.STEEDOS_TENANT_ENABLE_SAAS;
        //         if (STEEDOS_TENANT_ENABLE_SAAS) {
        //             try {
        //                 console.log("SAAS模式下钉钉消息推送");
        //                 console.log("====>options", options)
        //                 if (options.from !== 'workflow') {
        //                     return;
        //                 }
        //                 if (!options.payload) {
        //                     return;
        //                 }
        //                 const spaces = await this.broker.call('objectql.find', { objectName: 'spaces', query: { filters: [["_id", "=", options.payload.space]] } });
        //                 console.log("spaces消息推送", spaces);
        //                 let space = null;
        //                 if (spaces && spaces.length > 0) {
        //                     space = spaces[0]
        //                 }
        //                 if (!space) {
        //                     return;
        //                 }
        //                 if (!space.dingtalk_corp_id) {
        //                     return
        //                 }
        //                 let userId = options.query.userId;
        //                 const spaceUsers = await this.broker.call('objectql.find', { objectName: 'space_users', query: { filters: [["space", "=", space._id], ["user", "=", userId]] } });
        //                 let space_user = null;
        //                 if (spaceUsers.length > 0) {
        //                     space_user = spaceUsers[0]
        //                 }
        //                 if (!space_user.dingtalk_id) {
        //                     return;
        //                 }
                       
        //                 let dingtalk_userId = space_user.dingtalk_id;
        //                 let agentId = space.dingtalk_agent_id;
        //                 let spaceId = space._id;
        //                 let corpId = space.dingtalk_corp_id;
        //                 let payload = options.payload;
        //                 let url = "";
        //                 let text = "";
        //                 let title = "华炎魔方";
        //                 let dingtalk_config = await this.broker.call('@steedos/plugin-dingtalk.dingtalkgetConfigurations', {
        //                     "_id":corpId
        //                 });
        //                 console.log("=====dingtalk_config",dingtalk_config)
        //                 if (payload.instance) {
        //                     let pushInfo = await this.workflowPush(options, spaceId, corpId);
        //                     title = pushInfo.text;
        //                     text = pushInfo.title;
        //                     url = pushInfo.url;
        //                 } else {
        //                     title = options.title;
        //                     url = oauthUrl + corpId + "&redirect_url=" + payload.url;
        //                 }
        //                 let dintalk_url = "dingtalk://dingtalkclient/action/openapp?corpid=" + corpId + "&container_type=work_platform&app_id=136546&redirect_type=jump&redirect_url=" + encodeURIComponent(url);
        //                 // 通知消息主体
        //                 let msg = {
        //                     "userid_list": dingtalk_userId,
        //                     "agent_id": 2933586143,
        //                     "to_all_user": "false",
        //                     "msg": {
        //                         "msgtype": "oa",
        //                         "oa": {
        //                             "message_url": dintalk_url,
        //                             "pc_message_url": dintalk_url,
        //                             "head": {
        //                                 "bgcolor": "FFBBBBBB",
        //                                 "text": "华炎魔方"
        //                             },
        //                             "body": {
        //                                 "title": title,
        //                                 "author": text
        //                             }
        //                         }
        //                     }
        //                 }
        //                 // 发送推送消息
        //                 await dtApi.sendMessage(msg, dingtalk_config.suite_access_token);
        //             } catch (error) {
        //                 console.error("Push error reason: ", error);
        //             }

        //         } else {
        //             try {
        //                 if (options.from !== 'workflow')
        //                     return;

        //                 if (!options.payload)
        //                     return;

        //                 const spaces = await this.broker.call('objectql.find', { objectName: 'spaces', query: { filters: [["_id", "=", options.payload.space]] } });

        //                 let space = null;

        //                 if (spaces && spaces.length > 0) {
        //                     space = spaces[0]
        //                 }

        //                 if (!space)
        //                     return;

        //                 if (!space.dingtalk_corp_id || !space.dingtalk_agent_id || !space.dingtalk_key || !space.dingtalk_secret)
        //                     return;
        //                 let token = await dtApi.accessTokenGet(space.dingtalk_key, space.dingtalk_secret);

        //                 let userId = options.query.userId;
        //                 const spaceUsers = await this.broker.call('objectql.find', { objectName: 'space_users', query: { filters: [["space", "=", space._id], ["user", "=", userId]] } });
        //                 let space_user = null;
        //                 if (spaceUsers.length > 0) {
        //                     space_user = spaceUsers[0]
        //                 }
        //                 if (!space_user.dingtalk_id)
        //                     return;

        //                 let dingtalk_userId = space_user.dingtalk_id;
        //                 let agentId = space.dingtalk_agent_id;
        //                 let spaceId = space._id;
        //                 let corpId = space.dingtalk_corp_id;
        //                 let payload = options.payload;
        //                 let url = "";
        //                 let text = "";
        //                 let title = "华炎魔方";

        //                 // 审批流程
        //                 if (payload.instance) {
        //                     let pushInfo = await this.workflowPush(options, spaceId, corpId);
        //                     title = pushInfo.text;
        //                     text = pushInfo.title;
        //                     url = pushInfo.url;
        //                 } else {
        //                     title = options.title;
        //                     url = oauthUrl + corpId + "&redirect_url=" + payload.url;
        //                 }

        //                 if (payload.related_to) {
        //                     text = options.text;
        //                 }
        //                 // url: dingtalk://dingtalkclient/action/openapp?corpid=免登企业corpId&container_type=work_platform&app_id=0_{应用agentid}&redirect_type=jump&redirect_url=跳转url
        //                 let dintalk_url = "dingtalk://dingtalkclient/action/openapp?corpid=" + corpId + "&container_type=work_platform&app_id=0_" + space.dingtalk_agent_id + "&redirect_type=jump&redirect_url=" + encodeURIComponent(url);

        //                 // 通知消息主体
        //                 let msg = {
        //                     "userid_list": dingtalk_userId,
        //                     "agent_id": agentId,
        //                     "to_all_user": "false",
        //                     "msg": {
        //                         "msgtype": "oa",
        //                         "oa": {
        //                             "message_url": dintalk_url,
        //                             "pc_message_url": dintalk_url,
        //                             "head": {
        //                                 "bgcolor": "FFBBBBBB",
        //                                 "text": "华炎魔方"
        //                             },
        //                             "body": {
        //                                 "title": title,
        //                                 "author": text
        //                             }
        //                         }
        //                     }
        //                 }
        //                 // 发送推送消息
        //                 await dtApi.sendMessage(msg, token.access_token);
        //             } catch (error) {
        //                 console.error("Push error reason: ", error);
        //             }
        //         }

        //     }
        // }
    },

    methods: {
        // 待审核推送
        workflowPush: async function (options, spaceId, corpId) {
            if (!options || (options == {}))
                return false;

            let info = {};
            info.text = "";
            info.url = "";
            info.title = "审批王";
            // 获取申请单
            let instanceId = options.payload.instance;
            let instance = await this.broker.call('objectql.findOne', { objectName: 'instances', id: instanceId });
            let inboxUrl = oauthUrl + corpId + '&redirect_url=/api/workflow/instance/' + options.payload.instance;

            let outboxUrl = oauthUrl + corpId + '&redirect_url=/api/workflow/instance/' + options.payload.instance;

            info.text = '请审批 ' + options.text;
            info.url = inboxUrl;
            info.title = options.title;

            if (!instance) {
                info.text = options.text;
            } else {
                if (instance.state == "completed") {
                    info.text = options.text;
                    info.url = outboxUrl;
                }
            }
            return info;
        },
        sign: function (ticket, nonceStr, timeStamp, url) {
            let plain = 'jsapi_ticket=' + ticket +
                '&noncestr=' + nonceStr +
                '&timestamp=' + timeStamp +
                '&url=' + url;

            let sha1 = crypto.createHash('sha1');
            sha1.update(plain, 'utf8');
            let signature = sha1.digest('hex');
            return signature;
        },
        getSpaceByDingtalk: async function (corpId) {
            const spaces = await this.broker.call('objectql.find', { objectName: 'spaces', query: { filters: [["dingtalk_corp_id", "=", corpId]] } });
            return spaces.length > 0 ? spaces[0] : null;
        },
        getSpaceById: async function (spaceId) {
            const spaces = await this.broker.call('objectql.find', { objectName: 'spaces', query: { filters: [["_id", "=", spaceId]] } });
            return spaces.length > 0 ? spaces[0] : null;
        },
        getSpaceUserByDingtalk: async function (userId) {
            const records = await this.broker.call('objectql.find', { objectName: 'space_users', query: { filters: [["dingtalk_id", "=", userId]] } });
            return records.length > 0 ? records[0] : null;
        },
        getSpaceTop1: async function () {
            const records = await this.broker.call('objectql.find', { objectName: 'spaces', query: { top: 1 } });
            return records.length > 0 ? records[0] : null;
        }
    }
}