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