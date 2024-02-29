// 获取企业的jsapi_ticket
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const suiteConfObj = this.getObject("qywx_suite_configurations");
        let suite_id = process.env.STEEDOS_QYWX_SAAS_SUITEID;
        // 获取费控王应用配置
        const fkwConfig = await suiteConfObj.findOne(suite_id);
        const { suite_access_token } = fkwConfig
        const qyapi = qywx_api.getJsapiTicket;
        const getJsapiTicketUrl = qyapi + "?access_token=" + suite_access_token;
        const jsapiTicketInfo = await fetch(getJsapiTicketUrl).then(res => res.json());;
        console.log("jsapiTicketInfo", jsapiTicketInfo)
        return jsapiTicketInfo


    }
}