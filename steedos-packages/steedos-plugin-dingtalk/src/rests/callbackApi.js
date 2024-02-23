const aes = require('wx-ding-aes')
const DingTalkEncryptor = require('dingtalk-encrypt');
const utils = require('dingtalk-encrypt/Utils');
const crypto = require('crypto');
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
            var key = process.env.STEEDOS_DD_SAAS_SUITEKEY;
            var suiteSecret = process.env.STEEDOS_DD_SAAS_SUITESECRET;
            var corpId = process.env.STEEDOD_DD_SAAS_CORPID
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
                console.log("=====>bizData", data.data.bizData)
                const bizData = data.data.bizData;
                let suiteTicket = ""
                for (let dataDoc of bizData) {
                    if (dataDoc.biz_type == 2) {
                        let biz_data = JSON.parse(dataDoc.biz_data);
                        suiteTicket = biz_data.suiteTicket;
                        await this.broker.call('@steedos/plugin-dingtalk.dingtalkStoreSuiteTicket', {
                            "suiteTicket": suiteTicket
                        });
                 
                        break
                    }
                }
                for (let dataDoc of bizData) {
                    if (dataDoc.biz_type == 4) {
                        let biz_data = JSON.parse(dataDoc.biz_data);
                        // 初始化space
                        await this.broker.call('@steedos/plugin-dingtalk.dingtalkInitializeSpace', {
                            "authinfo": biz_data,
                            "authCorpId": corpId,
                            "suiteTicket": suiteTicket

                        });
                        break
                    }
                }
                // // 当前时间戳
                // let timestamp = new Date().getTime();
                // let biz_data = JSON.parse(data.data.bizData[0].biz_data);
                // console.log("=====>biz_data", biz_data)
                // if (biz_data.auth_user_info) {

                // }
                // let signatureString = `${timestamp}\n${biz_data.suiteTicket}`
                // let signingKey = suiteSecret
                //  let signinCode = crypto.createHmac('sha256', signingKey).update(signatureString).digest().toString('base64');
                //  console.log("=====>signinCode",signinCode);
                //  redirect_uri = encodeURIComponent(signinCode)
                //  console.log("========>签名urlEncode",redirect_uri)
                // // 获取企业授权信息
                // let authinfo = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetAuthinfo', {
                //     "accessKey": key,
                //     "timestamp":timestamp,
                //     "suiteTicket": biz_data.suiteTicket,
                //     "signature": redirect_uri,
                //     "suite_key": key,
                //     "auth_corpid": corpId
                // });

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