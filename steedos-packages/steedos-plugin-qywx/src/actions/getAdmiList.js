// 获取管理员成员列表
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
         const {auth_corpid,agentid,suite_access_token } = ctx.params;
         const qyapi = qywx_api.getAdminList;
         var data = {
            auth_corpid: auth_corpid,
            agentid: agentid
        };
        const getAdminListUrl = qyapi + "?suite_access_token=" + suite_access_token;
          // 获取管理员成员列表
          let adminList = await fetch(getAdminListUrl, {
            method: 'post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        // console.log("管理员列表",adminList);
        if(adminList.errcode == 0){
            return adminList.admin
        }else{
            return "";
        }    
    }
}