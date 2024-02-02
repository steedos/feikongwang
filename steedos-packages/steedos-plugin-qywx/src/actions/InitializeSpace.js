// 初始化space（应用安装时，就初始化space,同时定义space的管理员）
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const { auth_code } = ctx.params;

        const spaceObj = this.getObject('spaces');
        const usersObj = this.getObject('users');
        const spaceUsersObj = this.getObject("space_users");
        const organizationsObj = this.getObject("organizations");

        let suite_id = process.env.STEEDOS_QYWX_SAAS_SUITEID;
        // 获取费控王应用配置
        const fkwConfig = await this.getConfigurations(suite_id)
        const { suite_access_token } = fkwConfig

        // 获取永久授权码
        const permanentCodeConfig = await this.getPermanentCode(auth_code, suite_access_token);
        console.log("永久授权码", permanentCodeConfig)
        let auth_corpid = permanentCodeConfig.dealer_corp_info.corpid;
        let agentid = permanentCodeConfig.auth_info.agent[0].agentid
        // 获取管理员列表
        const adminList = await this.getAdmiList(auth_corpid, agentid, suite_access_token);
        console.log("====管理员列表",adminList)
        //  // 获取管理员信息
        //  const adminInfoList = await this.getAdminInfoList(adminList,access_token);
        let adminId = []
        for (let admin of adminList) {
            // 创建user
            const user = await usersObj.directInsert({
                name: admin.name,
                qywx_id: admin.userid
            })
            adminId.push(user._id)
        }
        // 创建space
        const space = await spaceObj.directInsert({
            name: permanentCodeConfig.corp_name,
            admins: adminId,
            owner: adminId[0],
            created_by: adminId[0],
            created: new Date(),
            modified_by: adminId[0],
            modified: new Date(),
            qywx_corp_id: permanentCodeConfig.corpid
        })
         // 创建space_users
        for (let admin of adminList) {
            // 根据企业微信userid查询user
            const userDoc = await usersObj.findOne({ filters: [['qywx_id', '=', admin.userid]] });
            const spaceUser = await spaceUsersObj.directInsert({
                name: permanentCodeConfig.corp_name,
                user: userDoc._id,
                owner: userDoc._id,
                created_by: userDoc._id,
                created: new Date(),
                modified_by: userDoc._id,
                modified: new Date(),
                qywx_id: admin.userid,
                space: space._id,
                profile: "admin",
                user_accepted: true
            })
        }
    }
}