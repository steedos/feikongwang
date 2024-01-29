const qywx_api = require('../router');
module.exports = {
    rest: {
        method: "GET",
        fullPath: "/api/qiyeweixin/mainpage",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
         //工作台首页
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
}