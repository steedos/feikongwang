// 初始化space（应用安装时，就初始化space,同时定义space的管理员）
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const { auth_corpid, agentid, suite_access_token} = ctx.params;
        const spaceObj = this.getObject('spaces');
        const usersObj = this.getObject('users');
        const spaceUsersObj = this.getObject("space_users");
        const organizationsObj = this.getObject("organizations");
        // 获取管理员列表
        const adminList = await this.getAdmiList(auth_corpid, agentid, suite_access_token);

        // 获取管理员信息
        const adminInfoList = await this.getAdminInfoList(adminList,access_token);

        let auth_code = "";
        // 获取永久授权码
        const permanentCode =  await this.getPermanentCode(auth_code,suite_access_token);
        let adminId = []
        for(let admin of  adminInfoList){
             // 创建user
          const user = await usersObj.directInsert({
                name: admin.name,
                qywx_id:admin.userid
            })
            adminId.push(user._id)
        }
           // 创建space
        const space = await spaceObj.directInsert({
            name: permanentCode.corp_name, 
            admins: adminId,
            owner: adminId[0], 
            created_by: adminId[0],
            created: new Date(),
            modified_by: adminId[0],
            modified: new Date(),
            qywx_corp_id: permanentCode.corpid
           })
        // 创建space_users
    }
}