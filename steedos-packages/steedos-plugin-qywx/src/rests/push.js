const Qiyeweixin = require("../qywx");
module.exports = {
    rest: {
        method: "POST",
        fullPath: "/api/qiyeweixin/push",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
         //推送消息
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
}