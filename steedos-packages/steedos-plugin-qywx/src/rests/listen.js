module.exports = {
    rest: {
        method: "GET",
        fullPath: "/api/qiyeweixin/listen",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
         //订阅事件
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
}