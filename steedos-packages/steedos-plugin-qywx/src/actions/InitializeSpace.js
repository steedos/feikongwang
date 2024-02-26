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
        const permanentCodeConfig = await this.broker.call('@steedos/plugin-qywx.getPermanentCode', { auth_code: auth_code, suite_access_token: suite_access_token });
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
            console.log("管理员列表", adminList)
            // let admin = adminList[0];


            // 获取管理员信息
            let adminId = []
            let adminInfos = []
            for (let admin of adminList) {
                // 创建user
                const user = await usersObj.directInsert({
                    name: admin.userid,
                    qywx_id: admin.userid,
                    created: new Date(),
                    modified: new Date(),
                    locale: "zh-cn",
                    user_accepted: true,
                    qywx_id: admin.userid
                })
                let adminInfo = {
                    "userId": user._id,
                    "qywx_admin_user": admin
                }
                adminInfos.push(adminInfo);
                adminId.push(user._id)
            }
            // 初始化工作区
            let space = await spaceObj.findOne({ filters: [['qywx_corp_id', '=', auth_corpid]] })
            if (space) {
                // 更新工作区
                await spaceObj.directUpdate(space._id, {
                    name: corp_name,
                    modified_by: space.owner,
                    modified: new Date(),
                    qywx_corp_id: auth_corpid,
                    qywx_permanent_code: permanent_code,
                    admins: adminId

                })
            } else {
                // 创建space
                space = await spaceObj.insert({
                    name: corp_name,
                    owner: adminId[0],
                    qywx_corp_id: auth_corpid,
                    qywx_permanent_code: permanent_code,
                    admins: adminId
                })
                await spaceObj.directUpdate(space._id, {
                    admins: adminId
                })

                // 初始化根部门
                let organizationDoc = await organizationsObj.findOne({ filters: [['space', '=', space._id], ["is_company", '=', true]] })
                if (organizationDoc) {
                    organizationDoc = await organizationsObj.directUpdate(organizationDoc._id, {
                        name: space.name,
                        fullname: space.name,
                        modified_by: space.owner,
                        qywx_id: "1",
                        qywx_space: auth_corpid,
                        modified: new Date()
                    })
                }
                // 创建space_users
                for (let userInfo of adminInfos) {
                    if (userInfo.userId == adminId[0]) {
                        let admin = await spaceUsersObj.findOne({ filters: [["user", "=", userInfo.userId], ["space", "=", space._id]] })
                        if (admin){
                            await spaceUsersObj.directUpdate(admin._id, {
                                qywx_id: userInfo.qywx_admin_user.userid,
                            })
                        }
                    } else {
                        const newSpaceUser = await spaceUsersObj.insert({
                            name: userInfo.qywx_admin_user.userid,
                            qywx_id: userInfo.qywx_admin_user.userid,
                            space: space._id,
                            locale: "zh-cn",
                            user: userInfo.userId,
                            organizations: new Array(organizationDoc._id),
                            organization: organizationDoc._id,
                            // user_accepted: true,
                            //created_by: space.owner

                        })
                        await spaceUsersObj.directUpdate(newSpaceUser._id, {
                            user_accepted: true,
                            invite_state: "accepted",
                            profile: 'admin',
                            // owner: newSpaceUser.user
                        })
                    }

                }
            }

            for (let userInfo of adminInfos) {
                // 根据企业微信userid查询space_user
                let spaceUser = await spaceUsersObj.findOne({ filters: [['space', '=', space._id], ['user', '=', userInfo.qywx_admin_user.userid]] });
                if (spaceUser) {
                    await spaceUsersObj.directUpdate(spaceUser._id, {
                        modified_by: userInfo.userId,
                        modified: new Date(),
                        qywx_id: userInfo.qywx_admin_user.userid,
                        profile: 'admin',
                    })
                }
            }




        } catch (error) {
            console.log("InitializeSpace error: ", error);
        }

    }
}