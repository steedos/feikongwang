const dd = require('dingtalk-jsapi');
module.exports = {
    handler: async function (ctx) {
        let { corpid } = ctx.params;
        dd.runtime.permission.requestAuthCode({
            corpId: "corpid",
            onSuccess: function(result) {
                c
            },
            onFail : function(err) {}
         
        })
    }
}