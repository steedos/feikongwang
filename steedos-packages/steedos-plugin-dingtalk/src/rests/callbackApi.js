const aes = require('wx-ding-aes')
const DingTalkEncryptor = require('dingtalk-encrypt');
const utils = require('dingtalk-encrypt/Utils');
module.exports = {
    rest: {
        method: "POST",
        fullPath: "/api/qiyeweixin/dingtalk/listen",
        authorization: false,
        authentication: false
    },
    async handler(ctx) {
        try {
            console.log("======事件回调", ctx.params);
            var callbackInfo = ctx.params;
            var signature = callbackInfo.signature;
            var nonce = callbackInfo.nonce;
            var timeStamp = callbackInfo.timestamp;
            var suiteId = process.env.STEEDOS_DD_SAAS_SUITEID;//必填，企业ID
            var token = process.env.STEEDOS_DD_SAAS_TOKEN;    //必须和在注册是一样
            var aesKey = process.env.STEEDOS_DD_SAAS_AESKEY;
            var key = process.env.STEEDOS_DD_SAAS_SUITEKEY
            var encrypt = callbackInfo.encrypt;

            data = await broker.call('dingtalk.decrypt', {
                data: {
                    signature: signature,
                    nonce: nonce,
                    timeStamp: timeStamp,
                    suiteKey: suiteId,
                    token: token,
                    aesKey: aesKey,
                    encrypt: encrypt
                }
            })
            console.log("==========>解密", data);
            const encryptor = new DingTalkEncryptor(token, aesKey, key);

            if (data.data.EventType == "check_create_suite_url") {
                return encryptor.getEncryptedMap('success', timeStamp, utils.getRandomStr(8));
            }
            if (data.data.EventType == "check_url") {
                return encryptor.getEncryptedMap('success', timeStamp, utils.getRandomStr(8));
            }
            if (data.data.EventType == "SYNC_HTTP_PUSH_HIGH") {
                console.log("=====>bizData",data.data.bizData)
                return encryptor.getEncryptedMap('success', timeStamp, utils.getRandomStr(8));
            }
            if (data.data.EventType == "check_update_suite_url") {
                return encryptor.getEncryptedMap('success', timeStamp, utils.getRandomStr(8));
            }
        } catch (error) {
            console.error("callback error reason: ", error);
        }
    }
}