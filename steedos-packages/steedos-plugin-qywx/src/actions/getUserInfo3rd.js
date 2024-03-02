// 获取访问用户身份
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
  handler: async function (ctx) {
    const { code, suite_access_token } = ctx.params;
    const qyapi = qywx_api.getUserInfo3rd;
    const access_token = ""
    const getUserInfo3rdUrl = qyapi + "?suite_access_token=" + suite_access_token + "&code=" + code;
    // 获取信息
    let response = await fetch(getUserInfo3rdUrl).then(res => res.json());
    if (response.errcode > 0) {
      throw response.errmsg;
    }
    return response

  }
}