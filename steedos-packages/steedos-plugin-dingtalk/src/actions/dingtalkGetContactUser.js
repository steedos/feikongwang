const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        // 获取用户通讯录个人信息
        let {accessToken,code} = ctx.params;
        let getuserinfoApi = "https://api.dingtalk.com/v1.0/contact/users/me"
        let response = await fetch(getuserinfoApi, {
            method: 'get',
            headers: {
                "x-acs-dingtalk-access-token":accessToken,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
          return response
    }
}