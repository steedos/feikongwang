const _ = require('lodash');
const path = require('path');
const project = require('../package.json');
// const objectql = require('@steedos/objectql');
const Qiyeweixin = require("./qywx");
const rests = require('./rests')
const packageLoader = require('@steedos/service-package-loader');
const methods = require('./methods')
const actions = require('./actions')
const packageName = project.name;
module.exports = {
    name: packageName,
    mixins: [packageLoader],
    /**
     * Settings
     */
    settings: {

    },

    metadata: {
        $package: {
            name: project.name,
            path: path.join(__dirname, ".."),
            isPackage: true
        }
    },

    /**
     * Dependencies
     */
    dependencies: [],

    /**
     * Actions
     */
    actions: {
        ...actions,
        ...rests,
    },

    /**
     * Events
     */
    events: {
        'push.send': {
            async handler(ctx) {
                const options = ctx.params;
                console.log("===>options", options)
                let STEEDOS_TENANT_ENABLE_SAAS = process.env.STEEDOS_TENANT_ENABLE_SAAS
                if (STEEDOS_TENANT_ENABLE_SAAS) {
                    try {
                        console.log("SAAS模式下消息推送");
                        let oauthUrl = await this.broker.call('objectql.absoluteUrl', { path: '/api/qiyeweixin/feikongwang/mainpage?target=' })
                        if (options.from !== 'workflow') {
                            return;
                        }
                        if (!options.payload) {
                            return;
                        }
                        let space = await this.broker.call('objectql.find', { objectName: 'spaces', query: { filters: [["_id", "=", options.payload.space]] } })
                        console.log("space信息", space);
                        if (!space[0] || !space[0].qywx_corp_id) {
                            return
                        }
                        let userId = options.query.userId;
                        let space_user = await this.broker.call('objectql.find', { objectName: 'space_users', query: { filters: [["space", "=", space[0]._id], ["user", "=", userId]] } })
                        console.log("space_user信息", space_user)
                        if (!space_user[0].qywx_id) {
                            return;
                        }
                        let qywx_userId = space_user[0].qywx_id;
                        let suite_id = process.env.STEEDOS_QYWX_SAAS_SUITEID;
                        // 获取企业AccessToken
                        const access_token_info = await broker.call('@steedos/plugin-qywx.getAccessToken', {
                            "suite_id": suite_id,
                            "auth_corpid": space[0].qywx_corp_id,
                            "permanent_code": space[0].qywx_permanent_code
                        });
                        console.log("access_token_info==>", access_token_info);
                        const authInfo = await this.broker.call('@steedos/plugin-qywx.getAuthInfo', { suite_id: suite_id, auth_corpid: space[0].qywx_corp_id, permanent_code: space[0].qywx_permanent_code });
                        // console.log("企业认证信息", authInfo)
                        let payload = options.payload;
                        let spaceId = space[0]._id;
                        let url = "";
                        let text = "";
                        let title = "华炎魔方";
                        if (payload.instance) {
                            let pushInfo = await Qiyeweixin.workflowPush(options, spaceId, oauthUrl);
                            console.log("======>pushInfo", pushInfo)
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
                        let agentid = authInfo.auth_info.agent[0].agentid
                        console.log("=======>agentid", agentid)
                        console.log("消息推送url----------",url)
                        // 替换&#x2F为'/'
                        let rg = new RegExp("&#x2F;", "g");
                        let msg = {
                            "touser": qywx_userId,
                            "msgtype": "textcard",
                            "agentid": agentid,
                            "textcard": {
                                "title": title.replace(rg, '/'),
                                "description": text.replace(rg, '/'),
                                "url": url,
                                "btntxt": "详情"
                            },
                            "safe": 0,
                            "enable_id_trans": 0,
                            "enable_duplicate_check": 0,
                            "duplicate_check_interval": 1
                        }
                        console.log("msg", msg);
                        // 发送推送消息
                        await Qiyeweixin.sendMessage(msg, access_token_info.access_token);
                    } catch (Exception) {
                        console.error("Push error reason: ", Exception);
                    }


                } else {
                    let oauthUrl = objectql.absoluteUrl('/api/qiyeweixin/mainpage?target=');
                    try {
                        // console.log("options:---",options);
                        if (options.from !== 'workflow')
                            return;

                        if (!options.payload)
                            return;

                        let space = await this.broker.call('objectql.find', { objectName: 'spaces', query: { filters: [["_id", "=", options.payload.space]] } })

                        if (!space[0])
                            return;

                        if (!space[0].qywx_corp_id || !space[0].qywx_agent_id || !space[0].qywx_secret)
                            return;

                        let response = await Qiyeweixin.getToken(space[0].qywx_corp_id, space[0].qywx_secret);
                        let access_token = response.access_token;

                        let userId = options.query.userId;
                        let space_user = await this.broker.call('objectql.find', { objectName: 'space_users', query: { filters: [["space", "=", space[0]._id], ["user", "=", userId]] } })

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
                        let rg = new RegExp("&#x2F;", "g")

                        let msg = {
                            "touser": qywx_userId,
                            "msgtype": "textcard",
                            "agentid": agentId,
                            "textcard": {
                                "title": title.replace(rg, '/'),
                                "description": text.replace(rg, '/'),
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
        }
    },

    /**
     * Methods
     */
    methods: methods,

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