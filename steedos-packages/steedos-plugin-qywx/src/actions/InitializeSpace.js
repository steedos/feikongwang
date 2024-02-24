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
        const suiteConfObj = this.getObject("qywx_suite_configurations");

        let suite_id = process.env.STEEDOS_QYWX_SAAS_SUITEID;
        // 获取费控王应用配置
        const fkwConfig = await suiteConfObj.findOne(suite_id);
        const { suite_access_token } = fkwConfig

        // 获取永久授权码
        const permanentCodeConfig = await this.broker.call('@steedos/plugin-qywx.getPermanentCode', {auth_code: auth_code, suite_access_token: suite_access_token});
        let auth_corpid = permanentCodeConfig.auth_corp_info.corpid;
        let agentid = permanentCodeConfig.auth_info.agent[0].agentid;
        let permanent_code = permanentCodeConfig.permanent_code;
        let corp_name = permanentCodeConfig.auth_corp_info.corp_name;
        try {
            // 获取管理员列表
            let adminList = await this.broker.call('@steedos/plugin-qywx.getAdmiList', {
                auth_corpid: auth_corpid, 
                agentid: agentid, 
                suite_access_token: suite_access_token
            });
            let admin = adminList[0];
            // 获取管理员信息
            let adminId = []
            // 创建user
            const user = await usersObj.directInsert({
                name: admin.userid,
                qywx_id: admin.userid,
                created: new Date(),
                modified: new Date(),
                locale: "zh-cn"
            })
            adminId.push(user._id);

            // 初始化工作区
            let space = await spaceObj.findOne({filters: [['qywx_corp_id', '=', auth_corpid]] })
            if (space){
                // 更新工作区
                await spaceObj.directUpdate(space._id, {
                    name: corp_name,
                    modified_by: space.owner,
                    modified: new Date(),
                    qywx_corp_id: auth_corpid,
                    qywx_permanent_code: permanent_code
                })
            }else {
                // 创建space
                space = await spaceObj.insert({
                    name: corp_name,
                    owner: adminId[0],
                    qywx_corp_id: auth_corpid,
                    qywx_permanent_code: permanent_code
                })
            }

            // 初始化根部门
            let organizationDoc = await organizationsObj.findOne({ filters: [['space', '=', space._id],["is_company", '=', true]] })
            if (organizationDoc){
                await organizationsObj.directUpdate(organizationDoc._id,{
                    name : space.name,
                    fullname : space.name,
                    modified_by : space.owner,
                    qywx_id: "1",
                    qywx_space: auth_corpid,
                    modified : new Date()
                })
            }

            // 根据企业微信userid查询space_user
            let spaceUser = await spaceUsersObj.findOne({ filters: [['space', '=', space._id],['user', '=', space.owner]] });
            if (spaceUser){
                await spaceUsersObj.directUpdate(spaceUser._id,{
                    modified_by: space.owner,
                    modified: new Date(),
                    qywx_id: admin.userid,
                })
            }

        } catch (error) {
            console.log("InitializeSpace error: ", error);
        }   

    }
}