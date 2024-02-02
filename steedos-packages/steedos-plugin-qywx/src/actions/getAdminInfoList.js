// 获取管理员成员信息列表
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
         const {adminList,access_token } = ctx.params;
         const qyapi = qywx_api.getuser;
         let adminInfoList = []
         if(adminList && adminList.length){
             for(let admin of adminList){
                const getUserUrl = qyapi + "?access_token=" + access_token+"&userid="+admin.userid;
                const adminInfo =  await fetch(getUserUrl);
                if(adminInfo.errcode==0){
                    adminInfoList.push(adminInfo)
                }
             }
         }
         return adminInfoList
        
       
    }
}